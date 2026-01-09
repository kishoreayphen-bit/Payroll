package com.payroll.service;

import com.payroll.dto.PayRunDTO;
import com.payroll.dto.PayRunEmployeeDTO;
import com.payroll.entity.*;
import com.payroll.entity.PayRun.PayRunStatus;
import com.payroll.entity.PayRunEmployee.PayRunEmployeeStatus;
import com.payroll.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PayRunService {

    private final PayRunRepository payRunRepository;
    private final PayRunEmployeeRepository payRunEmployeeRepository;
    private final EmployeeRepository employeeRepository;
    private final PayslipRepository payslipRepository;
    private final AttendanceService attendanceService;

    // Statutory rates (can be made configurable)
    private static final BigDecimal PF_RATE = new BigDecimal("0.12"); // 12%
    private static final BigDecimal ESI_EMPLOYEE_RATE = new BigDecimal("0.0075"); // 0.75%
    private static final BigDecimal ESI_EMPLOYER_RATE = new BigDecimal("0.0325"); // 3.25%
    private static final BigDecimal ESI_LIMIT = new BigDecimal("21000"); // ESI applicable if gross <= 21000

    @Transactional
    public PayRunDTO createPayRun(Long tenantId, PayRunDTO.CreatePayRunRequest request, Long userId) {
        log.info("Creating pay run for tenant: {} period: {} to {}", tenantId, request.getPayPeriodStart(),
                request.getPayPeriodEnd());

        // Check for existing pay run for the same period
        payRunRepository.findByTenantIdAndPayPeriod(tenantId, request.getPayPeriodStart(), request.getPayPeriodEnd())
                .ifPresent(existing -> {
                    throw new RuntimeException(
                            "A pay run already exists for this period: " + existing.getPayRunNumber());
                });

        // Create pay run
        PayRun payRun = new PayRun();
        payRun.setTenantId(tenantId);
        payRun.setPayPeriodStart(request.getPayPeriodStart());
        payRun.setPayPeriodEnd(request.getPayPeriodEnd());
        payRun.setPayDate(request.getPayDate() != null ? request.getPayDate() : request.getPayPeriodEnd().plusDays(5));
        payRun.setNotes(request.getNotes());
        payRun.setStatus(PayRunStatus.DRAFT);

        // Generate pay run number
        Long count = payRunRepository.countByTenantIdAndYear(tenantId, request.getPayPeriodStart().getYear());
        String payRunNumber = String.format("PR-%d-%04d", request.getPayPeriodStart().getYear(), count + 1);
        payRun.setPayRunNumber(payRunNumber);

        payRun = payRunRepository.save(payRun);

        // Get employees to include
        List<Employee> employees;
        if (request.getEmployeeIds() != null && !request.getEmployeeIds().isEmpty()) {
            employees = employeeRepository.findAllById(request.getEmployeeIds());
        } else {
            employees = employeeRepository.findByStatusAndOrganizationId("Active", tenantId);
        }

        // Create pay run employees
        for (Employee employee : employees) {
            PayRunEmployee pre = new PayRunEmployee();
            pre.setPayRun(payRun);
            pre.setEmployee(employee);
            pre.setStatus(PayRunEmployeeStatus.PENDING);

            // Set basic salary components from employee
            pre.setBasicSalary(employee.getBasicMonthly() != null ? employee.getBasicMonthly() : BigDecimal.ZERO);
            pre.setHra(employee.getHraMonthly() != null ? employee.getHraMonthly() : BigDecimal.ZERO);
            pre.setConveyanceAllowance(
                    employee.getConveyanceAllowanceMonthly() != null ? employee.getConveyanceAllowanceMonthly()
                            : BigDecimal.ZERO);
            pre.setFixedAllowance(employee.getFixedAllowanceMonthly() != null ? employee.getFixedAllowanceMonthly()
                    : BigDecimal.ZERO);

            // Calculate working days and LOP from attendance
            int month = request.getPayPeriodStart().getMonthValue();
            int year = request.getPayPeriodStart().getYear();

            log.info("=== PAY RUN: Calculating for Employee {} (ID: {}) - Month: {}, Year: {} ===", 
                    employee.getEmployeeId(), employee.getId(), month, year);

            int workingDays = attendanceService.calculateWorkingDaysInMonth(month, year);
            double lopDays = attendanceService.calculateLopDays(employee.getId(), month, year);
            double daysWorked = attendanceService.calculateDaysWorked(employee.getId(), month, year);

            log.info("=== PAY RUN: Employee {} - Raw LOP Days returned: {} ===", 
                    employee.getEmployeeId(), lopDays);

            pre.setWorkingDays(workingDays);
            pre.setDaysWorked((int) Math.round(daysWorked));
            pre.setLopDays((int) Math.ceil(lopDays)); // Round up LOP days

            log.info("=== PAY RUN: Employee {} - Final values: Working Days={}, Days Worked={}, LOP Days={} ===",
                    employee.getEmployeeId(), workingDays, daysWorked, pre.getLopDays());

            payRunEmployeeRepository.save(pre);
        }

        payRun.setEmployeeCount(employees.size());
        payRun = payRunRepository.save(payRun);

        return convertToDTO(payRun);
    }

    @Transactional
    public PayRunDTO calculatePayRun(Long payRunId, Long tenantId) {
        log.info("Calculating pay run: {}", payRunId);

        PayRun payRun = payRunRepository.findByIdAndTenantId(payRunId, tenantId)
                .orElseThrow(() -> new RuntimeException("Pay run not found"));

        if (payRun.getStatus() != PayRunStatus.DRAFT && payRun.getStatus() != PayRunStatus.PENDING_APPROVAL) {
            throw new RuntimeException("Pay run cannot be calculated in current status: " + payRun.getStatus());
        }

        payRun.setStatus(PayRunStatus.CALCULATING);
        payRunRepository.save(payRun);

        BigDecimal totalGross = BigDecimal.ZERO;
        BigDecimal totalDeductions = BigDecimal.ZERO;
        BigDecimal totalNet = BigDecimal.ZERO;
        BigDecimal totalEmployerContrib = BigDecimal.ZERO;

        List<PayRunEmployee> employees = payRunEmployeeRepository.findByPayRunId(payRunId);

        for (PayRunEmployee pre : employees) {
            calculateEmployeeSalary(pre);
            payRunEmployeeRepository.save(pre);

            totalGross = totalGross.add(pre.getGrossSalary());
            totalDeductions = totalDeductions.add(pre.getTotalDeductions());
            totalNet = totalNet.add(pre.getNetSalary());
            totalEmployerContrib = totalEmployerContrib.add(pre.getTotalEmployerContribution());
        }

        payRun.setTotalGrossPay(totalGross);
        payRun.setTotalDeductions(totalDeductions);
        payRun.setTotalNetPay(totalNet);
        payRun.setTotalEmployerContributions(totalEmployerContrib);
        payRun.setStatus(PayRunStatus.PENDING_APPROVAL);
        payRun.setProcessedAt(LocalDateTime.now());

        payRun = payRunRepository.save(payRun);

        return convertToDTO(payRun);
    }

    private void calculateEmployeeSalary(PayRunEmployee pre) {
        Employee employee = pre.getEmployee();

        // Calculate gross salary
        BigDecimal gross = pre.getBasicSalary()
                .add(pre.getHra())
                .add(pre.getConveyanceAllowance())
                .add(pre.getFixedAllowance())
                .add(pre.getOtherEarnings() != null ? pre.getOtherEarnings() : BigDecimal.ZERO);

        // Apply LOP deduction (Loss of Pay for absent days)
        if (pre.getLopDays() != null && pre.getLopDays() > 0 && pre.getWorkingDays() > 0) {
            // Calculate per-day salary rate
            BigDecimal dailyRate = gross.divide(BigDecimal.valueOf(pre.getWorkingDays()), 2, RoundingMode.HALF_UP);
            BigDecimal lopDeduction = dailyRate.multiply(BigDecimal.valueOf(pre.getLopDays()));
            pre.setLopDeduction(lopDeduction);
            gross = gross.subtract(lopDeduction);

            log.info("Employee {}: Daily Rate={}, LOP Days={}, LOP Deduction={}",
                    employee.getEmployeeId(), dailyRate, pre.getLopDays(), lopDeduction);
        } else {
            pre.setLopDeduction(BigDecimal.ZERO);
        }

        pre.setGrossSalary(gross);

        // Calculate PF (on basic salary)
        BigDecimal pfEmployee = pre.getBasicSalary().multiply(PF_RATE).setScale(0, RoundingMode.HALF_UP);
        BigDecimal pfEmployer = pre.getBasicSalary().multiply(PF_RATE).setScale(0, RoundingMode.HALF_UP);
        pre.setPfEmployee(pfEmployee);
        pre.setPfEmployer(pfEmployer);

        // Calculate ESI (if gross <= 21000)
        BigDecimal esiEmployee = BigDecimal.ZERO;
        BigDecimal esiEmployer = BigDecimal.ZERO;
        if (gross.compareTo(ESI_LIMIT) <= 0) {
            esiEmployee = gross.multiply(ESI_EMPLOYEE_RATE).setScale(0, RoundingMode.HALF_UP);
            esiEmployer = gross.multiply(ESI_EMPLOYER_RATE).setScale(0, RoundingMode.HALF_UP);
        }
        pre.setEsiEmployee(esiEmployee);
        pre.setEsiEmployer(esiEmployer);

        // Calculate Professional Tax (based on state, simplified)
        BigDecimal pt = calculateProfessionalTax(gross, employee);
        pre.setProfessionalTax(pt);

        // TDS calculation (simplified - actual would need full tax calculation)
        pre.setTds(BigDecimal.ZERO); // Placeholder for TDS calculation

        // Calculate totals
        pre.calculateTotals();
        pre.setStatus(PayRunEmployeeStatus.CALCULATED);
    }

    private BigDecimal calculateProfessionalTax(BigDecimal grossSalary, Employee employee) {
        // Simplified PT calculation for Karnataka (can be made state-specific)
        if (employee.getProfessionalTax() == null || !employee.getProfessionalTax()) {
            return BigDecimal.ZERO;
        }

        if (grossSalary.compareTo(new BigDecimal("15000")) <= 0) {
            return BigDecimal.ZERO;
        } else if (grossSalary.compareTo(new BigDecimal("25000")) <= 0) {
            return new BigDecimal("150");
        } else {
            return new BigDecimal("200");
        }
    }

    private int calculateWorkingDays(LocalDate start, LocalDate end) {
        // Simple calculation - can be enhanced for holidays
        YearMonth yearMonth = YearMonth.from(start);
        return yearMonth.lengthOfMonth();
    }

    @Transactional
    public PayRunDTO approvePayRun(Long payRunId, Long tenantId, Long userId) {
        log.info("Approving pay run: {} by user: {}", payRunId, userId);

        PayRun payRun = payRunRepository.findByIdAndTenantId(payRunId, tenantId)
                .orElseThrow(() -> new RuntimeException("Pay run not found"));

        if (payRun.getStatus() != PayRunStatus.PENDING_APPROVAL) {
            throw new RuntimeException("Pay run must be in PENDING_APPROVAL status to approve");
        }

        payRun.setStatus(PayRunStatus.APPROVED);
        payRun.setApprovedBy(userId);
        payRun.setApprovedAt(LocalDateTime.now());

        payRun = payRunRepository.save(payRun);

        return convertToDTO(payRun);
    }

    @Transactional
    public PayRunDTO completePayRun(Long payRunId, Long tenantId) {
        log.info("Completing pay run: {}", payRunId);

        PayRun payRun = payRunRepository.findByIdAndTenantId(payRunId, tenantId)
                .orElseThrow(() -> new RuntimeException("Pay run not found"));

        if (payRun.getStatus() != PayRunStatus.APPROVED) {
            throw new RuntimeException("Pay run must be APPROVED before completing");
        }

        // Mark all employees as paid
        List<PayRunEmployee> employees = payRunEmployeeRepository.findByPayRunId(payRunId);
        for (PayRunEmployee pre : employees) {
            pre.setStatus(PayRunEmployeeStatus.PAID);
            payRunEmployeeRepository.save(pre);
        }

        payRun.setStatus(PayRunStatus.COMPLETED);
        payRun = payRunRepository.save(payRun);

        return convertToDTO(payRun);
    }

    @Transactional
    public void cancelPayRun(Long payRunId, Long tenantId) {
        log.info("Cancelling pay run: {}", payRunId);

        PayRun payRun = payRunRepository.findByIdAndTenantId(payRunId, tenantId)
                .orElseThrow(() -> new RuntimeException("Pay run not found"));

        // Can only cancel DRAFT or PENDING_APPROVAL pay runs
        if (payRun.getStatus() != PayRunStatus.DRAFT && payRun.getStatus() != PayRunStatus.PENDING_APPROVAL) {
            throw new RuntimeException("Can only cancel pay runs in DRAFT or PENDING_APPROVAL status");
        }

        payRun.setStatus(PayRunStatus.CANCELLED);
        payRun = payRunRepository.save(payRun);

        log.info("Pay run {} cancelled successfully", payRunId);
    }

    @Transactional
    public void deletePayRun(Long payRunId, Long tenantId) {
        log.info("Deleting pay run: {}", payRunId);

        PayRun payRun = payRunRepository.findByIdAndTenantId(payRunId, tenantId)
                .orElseThrow(() -> new RuntimeException("Pay run not found"));

        // Can only delete DRAFT, CANCELLED, or COMPLETED pay runs
        if (payRun.getStatus() == PayRunStatus.APPROVED || payRun.getStatus() == PayRunStatus.CALCULATING) {
            throw new RuntimeException("Cannot delete pay runs in APPROVED or CALCULATING status. Cancel it first.");
        }

        // Delete all pay run employees first
        List<PayRunEmployee> employees = payRunEmployeeRepository.findByPayRunId(payRunId);
        payRunEmployeeRepository.deleteAll(employees);

        // Delete the pay run
        payRunRepository.delete(payRun);

        log.info("Pay run {} deleted successfully", payRunId);
    }

    public List<PayRunDTO> getPayRuns(Long tenantId) {
        return payRunRepository.findByTenantIdOrderByCreatedAtDesc(tenantId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public PayRunDTO getPayRun(Long payRunId, Long tenantId) {
        PayRun payRun = payRunRepository.findByIdAndTenantId(payRunId, tenantId)
                .orElseThrow(() -> new RuntimeException("Pay run not found"));
        return convertToDTO(payRun);
    }

    @Transactional(readOnly = true)
    public PayRunDTO getPayRunWithEmployees(Long payRunId, Long tenantId) {
        PayRun payRun = payRunRepository.findByIdAndTenantId(payRunId, tenantId)
                .orElseThrow(() -> new RuntimeException("Pay run not found"));

        PayRunDTO dto = convertToDTO(payRun);

        List<PayRunEmployee> employees = payRunEmployeeRepository.findByPayRunIdOrderByEmployeeName(payRunId);
        dto.setEmployees(employees.stream()
                .map(this::convertToEmployeeDTO)
                .collect(Collectors.toList()));

        return dto;
    }

    @Transactional
    public PayRunEmployeeDTO updatePayRunEmployee(Long payRunId, Long employeeId,
            PayRunEmployeeDTO.UpdateRequest request, Long tenantId) {
        PayRun payRun = payRunRepository.findByIdAndTenantId(payRunId, tenantId)
                .orElseThrow(() -> new RuntimeException("Pay run not found"));

        if (payRun.getStatus() != PayRunStatus.DRAFT && payRun.getStatus() != PayRunStatus.PENDING_APPROVAL) {
            throw new RuntimeException("Cannot update employee in current pay run status");
        }

        PayRunEmployee pre = payRunEmployeeRepository.findByPayRunIdAndEmployeeId(payRunId, employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found in pay run"));

        if (request.getLopDays() != null) {
            pre.setLopDays(request.getLopDays());
            pre.setDaysWorked(pre.getWorkingDays() - request.getLopDays());
        }
        if (request.getOtherEarnings() != null) {
            pre.setOtherEarnings(request.getOtherEarnings());
        }
        if (request.getOtherDeductions() != null) {
            pre.setOtherDeductions(request.getOtherDeductions());
        }
        if (request.getNotes() != null) {
            pre.setNotes(request.getNotes());
        }
        if (request.getStatus() != null) {
            pre.setStatus(PayRunEmployeeStatus.valueOf(request.getStatus()));
        }

        pre = payRunEmployeeRepository.save(pre);

        return convertToEmployeeDTO(pre);
    }

    private PayRunDTO convertToDTO(PayRun entity) {
        PayRunDTO dto = new PayRunDTO();
        dto.setId(entity.getId());
        dto.setPayRunNumber(entity.getPayRunNumber());
        dto.setTenantId(entity.getTenantId());
        dto.setPayPeriodStart(entity.getPayPeriodStart());
        dto.setPayPeriodEnd(entity.getPayPeriodEnd());
        dto.setPayDate(entity.getPayDate());
        dto.setStatus(entity.getStatus().name());
        dto.setTotalGrossPay(entity.getTotalGrossPay());
        dto.setTotalDeductions(entity.getTotalDeductions());
        dto.setTotalNetPay(entity.getTotalNetPay());
        dto.setTotalEmployerContributions(entity.getTotalEmployerContributions());
        dto.setEmployeeCount(entity.getEmployeeCount());
        dto.setNotes(entity.getNotes());
        dto.setProcessedBy(entity.getProcessedBy());
        dto.setProcessedAt(entity.getProcessedAt());
        dto.setApprovedBy(entity.getApprovedBy());
        dto.setApprovedAt(entity.getApprovedAt());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }

    private PayRunEmployeeDTO convertToEmployeeDTO(PayRunEmployee entity) {
        PayRunEmployeeDTO dto = new PayRunEmployeeDTO();
        dto.setId(entity.getId());
        dto.setPayRunId(entity.getPayRun().getId());
        dto.setEmployeeId(entity.getEmployee().getId());
        dto.setEmployeeNumber(entity.getEmployee().getEmployeeId());
        dto.setEmployeeName(entity.getEmployee().getFirstName() + " " + entity.getEmployee().getLastName());
        dto.setDesignation(entity.getEmployee().getDesignation());
        dto.setDepartment(entity.getEmployee().getDepartment());

        dto.setBasicSalary(entity.getBasicSalary());
        dto.setHra(entity.getHra());
        dto.setConveyanceAllowance(entity.getConveyanceAllowance());
        dto.setFixedAllowance(entity.getFixedAllowance());
        dto.setOtherEarnings(entity.getOtherEarnings());
        dto.setGrossSalary(entity.getGrossSalary());

        dto.setWorkingDays(entity.getWorkingDays());
        dto.setDaysWorked(entity.getDaysWorked());
        dto.setLeaveDays(entity.getLeaveDays());
        dto.setLopDays(entity.getLopDays());
        dto.setLopDeduction(entity.getLopDeduction());

        dto.setPfEmployee(entity.getPfEmployee());
        dto.setEsiEmployee(entity.getEsiEmployee());
        dto.setProfessionalTax(entity.getProfessionalTax());
        dto.setTds(entity.getTds());
        dto.setOtherDeductions(entity.getOtherDeductions());
        dto.setTotalDeductions(entity.getTotalDeductions());

        dto.setPfEmployer(entity.getPfEmployer());
        dto.setEsiEmployer(entity.getEsiEmployer());
        dto.setTotalEmployerContribution(entity.getTotalEmployerContribution());

        dto.setNetSalary(entity.getNetSalary());
        dto.setStatus(entity.getStatus().name());
        dto.setPayslipGenerated(entity.getPayslipGenerated());
        dto.setPayslipSent(entity.getPayslipSent());
        dto.setNotes(entity.getNotes());

        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());

        return dto;
    }
}
