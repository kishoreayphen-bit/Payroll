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
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
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
    private final StatutorySettingsRepository statutorySettingsRepository;
    private final PayRunEmployeeSkipRepository skipRepository;
    private final PayRunOneTimeComponentRepository oneTimeComponentRepository;
    private final ReimbursementRepository reimbursementRepository;

    @PersistenceContext
    private EntityManager entityManager;

    // Statutory rates (can be made configurable)
    // Statutory Rates removed (moved to database or settings)

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

        if (request.getPayRunType() != null) {
            payRun.setPayRunType(PayRun.PayRunType.valueOf(request.getPayRunType()));
        }

        // Generate pay run number (Sequential Zoho-style)
        int year = request.getPayPeriodStart().getYear();
        int month = request.getPayPeriodStart().getMonthValue();
        String latestNumber = payRunRepository.findLatestPayRunNumber(tenantId, year).orElse(null);
        int nextId = 1;

        if (latestNumber != null) {
            try {
                String[] parts = latestNumber.split("-");
                if (parts.length >= 3) {
                    String seqStr = parts[2];
                    if (seqStr.contains("-"))
                        seqStr = seqStr.split("-")[0];
                    nextId = Integer.parseInt(seqStr) + 1;
                }
            } catch (Exception e) {
                log.warn("Failed to parse latest pay run number: {}, falling back to count", latestNumber);
                nextId = payRunRepository.countByTenantIdAndYear(tenantId, year).intValue() + 1;
            }
        }

        String payRunNumber = String.format("PR-%d-%04d", year, nextId);

        // Final safety check loop
        int securityLoop = 0;
        String basePayRunNumber = payRunNumber;
        while (payRunRepository.findByPayRunNumber(payRunNumber).isPresent() && securityLoop < 10) {
            securityLoop++;
            payRunNumber = String.format("%s-%d", basePayRunNumber, (int) (Math.random() * 900) + 100);
            log.info("Collision detected for {}, trying alternate number: {}", basePayRunNumber, payRunNumber);
        }

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

            // Calculate working days and LOP from attendance (with safe defaults if
            // attendance data unavailable)
            int workingDays = 0;
            double lopDays = 0.0;
            double daysWorked = 0.0;

            try {
                log.info("=== PAY RUN: Calculating for Employee {} (ID: {}) - Month: {}, Year: {} ===",
                        employee.getEmployeeId(), employee.getId(), month, year);

                workingDays = attendanceService.calculateWorkingDaysInMonth(month, year);
                lopDays = attendanceService.calculateLopDays(employee.getId(), month, year);
                daysWorked = attendanceService.calculateDaysWorked(employee.getId(), month, year);

                log.info("=== PAY RUN: Employee {} - Raw LOP Days returned: {} ===",
                        employee.getEmployeeId(), lopDays);
            } catch (Exception ex) {
                log.warn(
                        "Failed to calculate attendance for employee {}: {}. Using defaults (workingDays=0, lopDays=0, daysWorked=0)",
                        employee.getEmployeeId(), ex.getMessage());
                // Defaults already set above
            }

            pre.setWorkingDays(workingDays);
            pre.setDaysWorked((int) Math.round(daysWorked));
            pre.setLopDays(java.math.BigDecimal.valueOf(lopDays));

            log.info("=== PAY RUN: Employee {} - Final values: Working Days={}, Days Worked={}, LOP Days={} ===",
                    employee.getEmployeeId(), workingDays, daysWorked, pre.getLopDays());

            try {
                pre = payRunEmployeeRepository.save(pre);
            } catch (Exception saveEx) {
                log.error("Failed to save PayRunEmployee for employee {}: {}", employee.getEmployeeId(),
                        saveEx.getMessage(), saveEx);
                throw new RuntimeException("Failed to save pay run employee: " + saveEx.getMessage(), saveEx);
            }

            // Zoho Flow: Check for unpaid arrears from previous months (only if tables
            // exist)
            if (arrearsTablesAvailable()) {
                try {
                    List<PayRunEmployeeSkip> arrearsSkips = skipRepository
                            .findByEmployeeIdAndSkipTypeAndProcessedInPayRunIdIsNull(employee.getId(),
                                    PayRunEmployeeSkip.SkipType.PAY_AS_ARREARS);

                    for (PayRunEmployeeSkip skip : arrearsSkips) {
                        // Pull into current pay run as a one-time component (Earning)
                        PayRunOneTimeComponent arrearComp = new PayRunOneTimeComponent();
                        arrearComp.setPayRunEmployeeId(pre.getId());
                        arrearComp.setComponentType(PayRunOneTimeComponent.ComponentType.EARNING);
                        arrearComp.setComponentName("Arrears (Skipped Payment)");
                        arrearComp
                                .setAmount(skip.getCarriedOverAmount() != null ? skip.getCarriedOverAmount()
                                        : BigDecimal.ZERO);
                        arrearComp.setIsTaxable(true);
                        arrearComp.setNotes(
                                "Automatically carried forward from previous skip. Reason: " + skip.getReason());
                        arrearComp.setTenantId(tenantId);
                        oneTimeComponentRepository.save(arrearComp);

                        // Link skip to this pay run (will be marked as fully processed on completion)
                        skip.setProcessedInPayRunId(payRun.getId());
                        skipRepository.save(skip);

                        log.info("Pulled arrears of {} into pay run {} for employee {}",
                                arrearComp.getAmount(), payRun.getId(), employee.getEmployeeId());

                        // Update employee other earnings
                        pre.setOtherEarnings(pre.getOtherEarnings().add(arrearComp.getAmount()));
                        payRunEmployeeRepository.save(pre);
                    }
                } catch (Exception ex) {
                    log.warn("Arrears skip processing failed: {}. Continuing without arrears.", ex.getMessage());
                }
            } else {
                log.info("Arrears tables not present. Skipping arrears integration for this environment.");
            }
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

        // Allow recalculation from CALCULATING status (in case previous calculation
        // failed)
        if (payRun.getStatus() != PayRunStatus.DRAFT &&
                payRun.getStatus() != PayRunStatus.PENDING_APPROVAL &&
                payRun.getStatus() != PayRunStatus.CALCULATING) {
            throw new RuntimeException("Pay run cannot be calculated in current status: " + payRun.getStatus());
        }

        payRun.setStatus(PayRunStatus.CALCULATING);
        payRunRepository.save(payRun);

        try {
            BigDecimal totalGross = BigDecimal.ZERO;
            BigDecimal totalDeductions = BigDecimal.ZERO;
            BigDecimal totalNet = BigDecimal.ZERO;
            BigDecimal totalEmployerContrib = BigDecimal.ZERO;

            List<PayRunEmployee> employees = payRunEmployeeRepository.findByPayRunId(payRunId);

            for (PayRunEmployee pre : employees) {
                calculateEmployeeSalary(pre, tenantId);
                payRunEmployeeRepository.save(pre);

                totalGross = totalGross.add(pre.getGrossSalary() != null ? pre.getGrossSalary() : BigDecimal.ZERO);
                totalDeductions = totalDeductions
                        .add(pre.getTotalDeductions() != null ? pre.getTotalDeductions() : BigDecimal.ZERO);
                totalNet = totalNet.add(pre.getNetSalary() != null ? pre.getNetSalary() : BigDecimal.ZERO);
                totalEmployerContrib = totalEmployerContrib
                        .add(pre.getTotalEmployerContribution() != null ? pre.getTotalEmployerContribution()
                                : BigDecimal.ZERO);
            }

            payRun.setTotalGrossPay(totalGross);
            payRun.setTotalDeductions(totalDeductions);
            payRun.setTotalNetPay(totalNet);
            payRun.setTotalEmployerContributions(totalEmployerContrib);
            payRun.setStatus(PayRunStatus.DRAFT); // Stay in DRAFT after calculation for Zoho flow
            payRun.setProcessedAt(LocalDateTime.now());

            payRun = payRunRepository.save(payRun);
            log.info("Pay run {} calculated successfully. Total Net: {}", payRunId, totalNet);

            return convertToDTO(payRun);
        } catch (Exception e) {
            log.error("Error calculating pay run {}: {}", payRunId, e.getMessage(), e);
            // Revert status to DRAFT so user can retry
            payRun.setStatus(PayRunStatus.DRAFT);
            payRunRepository.save(payRun);
            throw new RuntimeException("Failed to calculate pay run: " + e.getMessage(), e);
        }
    }

    public int resetStuckCalculatingPayRuns(Long tenantId) {
        List<PayRun> stuckPayRuns = payRunRepository.findByTenantIdAndStatus(tenantId, PayRunStatus.CALCULATING);
        int count = 0;
        for (PayRun payRun : stuckPayRuns) {
            log.info("Resetting stuck pay run {} from CALCULATING to DRAFT", payRun.getId());
            payRun.setStatus(PayRunStatus.DRAFT);
            payRunRepository.save(payRun);
            count++;
        }
        log.info("Reset {} stuck pay runs for tenant {}", count, tenantId);
        return count;
    }

    private void calculateEmployeeSalary(PayRunEmployee pre, Long tenantId) {
        if (Boolean.TRUE.equals(pre.getIsSkipped())) {
            return;
        }

        PayRun payRun = pre.getPayRun();
        Employee employee = pre.getEmployee();

        // Zoho Flow: Handle Pay Run Types (null-safe)
        PayRun.PayRunType payRunType = payRun.getPayRunType();
        if (payRunType == PayRun.PayRunType.ONE_TIME_PAYOUT) {
            // One-time payouts usually only include special components, not regular salary
            pre.setBasicSalary(BigDecimal.ZERO);
            pre.setHra(BigDecimal.ZERO);
            pre.setConveyanceAllowance(BigDecimal.ZERO);
            pre.setFixedAllowance(BigDecimal.ZERO);
            pre.setLopDeduction(BigDecimal.ZERO);
            // Preserves existing otherEarnings (the payout amount)
        } else if (payRunType == PayRun.PayRunType.RESETTLEMENT) {
            // Full & Final settlement logic would involve additional terminal components
            // For now, we calculate pro-rated regular salary plus adjustments
            // Terminal benefits like Gratuity/Encashment should be added via One-Time
            // Components
        } else {
            // REGULAR, OFF_CYCLE, or null - preserve employee defaults set during create
        }

        BigDecimal basicSalary = pre.getBasicSalary() != null ? pre.getBasicSalary() : BigDecimal.ZERO;
        BigDecimal hra = pre.getHra() != null ? pre.getHra() : BigDecimal.ZERO;
        BigDecimal conveyance = pre.getConveyanceAllowance() != null ? pre.getConveyanceAllowance() : BigDecimal.ZERO;
        BigDecimal fixedAllowance = pre.getFixedAllowance() != null ? pre.getFixedAllowance() : BigDecimal.ZERO;
        BigDecimal otherEarnings = pre.getOtherEarnings() != null ? pre.getOtherEarnings() : BigDecimal.ZERO;

        BigDecimal gross = basicSalary
                .add(hra)
                .add(conveyance)
                .add(fixedAllowance)
                .add(otherEarnings);

        // Apply LOP deduction only if it's not a one-time payout (null-safe)
        if (payRunType != PayRun.PayRunType.ONE_TIME_PAYOUT) {
            if (pre.getLopDays() != null && pre.getLopDays().compareTo(BigDecimal.ZERO) > 0
                    && pre.getWorkingDays() != null && pre.getWorkingDays() > 0) {
                BigDecimal dailyRate = gross.divide(BigDecimal.valueOf(pre.getWorkingDays()), 2, RoundingMode.HALF_UP);
                BigDecimal lopDeduction = dailyRate.multiply(pre.getLopDays()).setScale(2, RoundingMode.HALF_UP);
                pre.setLopDeduction(lopDeduction);
                gross = gross.subtract(lopDeduction);
            } else {
                pre.setLopDeduction(BigDecimal.ZERO);
            }
        }

        pre.setGrossSalary(gross);

        // Calculate PF with Configurable Logic
        com.payroll.entity.StatutorySettings settings = statutorySettingsRepository.findByTenantId(tenantId)
                .orElse(new com.payroll.entity.StatutorySettings());

        BigDecimal ratio = BigDecimal.ONE;
        if (pre.getWorkingDays() > 0 && pre.getDaysWorked() > 0) {
            ratio = BigDecimal.valueOf(pre.getDaysWorked())
                    .divide(BigDecimal.valueOf(pre.getWorkingDays()), 4, RoundingMode.HALF_UP);
            if (ratio.compareTo(BigDecimal.ONE) > 0)
                ratio = BigDecimal.ONE;
        }

        // Calculate Earned Basic (approximate based on LOP ratio)
        BigDecimal earnedBasic = basicSalary.multiply(ratio).setScale(2, RoundingMode.HALF_UP);

        // Calculate Earned Allowances
        BigDecimal earnedAllowances = (hra.add(conveyance).add(fixedAllowance))
                .multiply(ratio).setScale(2, RoundingMode.HALF_UP);
        earnedAllowances = earnedAllowances.add(otherEarnings);

        BigDecimal pfEmployee = BigDecimal.ZERO;
        BigDecimal pfEmployer = BigDecimal.ZERO;

        boolean isPfEnabled = settings.getPfEnabled() == null || settings.getPfEnabled();

        if (isPfEnabled) {
            BigDecimal pfWage = earnedBasic;
            BigDecimal wageCap = settings.getPfWageCeiling() != null ? settings.getPfWageCeiling()
                    : new BigDecimal("15000");

            // Rule: Pro-rate Cap? (LOP Adjustment)
            if (Boolean.TRUE.equals(settings.getProrateRestrictedPfWage())) {
                wageCap = wageCap.multiply(ratio).setScale(2, RoundingMode.HALF_UP);
            }

            // Rule: Include Allowances if Basic < Cap
            if (Boolean.TRUE.equals(settings.getIncludeAllowancesIfPfWageLow()) && earnedBasic.compareTo(wageCap) < 0) {
                pfWage = pfWage.add(earnedAllowances);
            }

            // Rule: Restrict Wage to Cap
            if (Boolean.TRUE.equals(settings.getRestrictPfWage())) {
                if (pfWage.compareTo(wageCap) > 0) {
                    pfWage = wageCap;
                }
            }

            BigDecimal empRate = settings.getPfEmployeeRate() != null ? settings.getPfEmployeeRate()
                    : new BigDecimal("12");
            BigDecimal emprRate = settings.getPfEmployerRate() != null ? settings.getPfEmployerRate()
                    : new BigDecimal("12");

            pfEmployee = pfWage.multiply(empRate).divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP);
            pfEmployer = pfWage.multiply(emprRate).divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP);
        }

        pre.setPfEmployee(pfEmployee);
        pre.setPfEmployer(pfEmployer);

        // Calculate ESI
        BigDecimal esiEmployee = BigDecimal.ZERO;
        BigDecimal esiEmployer = BigDecimal.ZERO;

        boolean isEsiEnabled = settings.getEsiEnabled() == null || settings.getEsiEnabled();
        BigDecimal esiLimit = settings.getEsiWageCeiling() != null ? settings.getEsiWageCeiling()
                : new BigDecimal("21000");

        if (isEsiEnabled && gross.compareTo(esiLimit) <= 0) {
            BigDecimal esiEmpRate = settings.getEsiEmployeeRate() != null ? settings.getEsiEmployeeRate()
                    : new BigDecimal("0.75");
            BigDecimal esiEmprRate = settings.getEsiEmployerRate() != null ? settings.getEsiEmployerRate()
                    : new BigDecimal("3.25");

            esiEmployee = gross.multiply(esiEmpRate).divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP);
            esiEmployer = gross.multiply(esiEmprRate).divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP);
        }
        pre.setEsiEmployee(esiEmployee);
        pre.setEsiEmployer(esiEmployer);

        // Calculate Professional Tax
        BigDecimal pt = BigDecimal.ZERO;
        if (settings.getPtEnabled() == null || settings.getPtEnabled()) {
            pt = calculateProfessionalTax(gross, employee);
        }
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

    @Transactional
    public PayRunDTO submitForApproval(Long payRunId, Long tenantId, Long userId) {
        log.info("Submitting pay run for approval: {} by user: {}", payRunId, userId);

        PayRun payRun = payRunRepository.findByIdAndTenantId(payRunId, tenantId)
                .orElseThrow(() -> new RuntimeException("Pay run not found"));

        if (payRun.getStatus() != PayRunStatus.DRAFT) {
            throw new RuntimeException("Pay run must be in DRAFT status to submit for approval");
        }

        payRun.setStatus(PayRunStatus.PENDING_APPROVAL);
        // In a real multi-level system, this might trigger emails
        payRun = payRunRepository.save(payRun);

        return convertToDTO(payRun);
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
    public PayRunDTO recordPayment(Long payRunId, List<Long> employeeIds, LocalDate paymentDate, Long tenantId) {
        log.info("Recording payment for pay run: {} employees: {}", payRunId, employeeIds);

        PayRun payRun = payRunRepository.findByIdAndTenantId(payRunId, tenantId)
                .orElseThrow(() -> new RuntimeException("Pay run not found"));

        if (payRun.getStatus() != PayRunStatus.APPROVED && payRun.getStatus() != PayRunStatus.PROCESSING) {
            throw new RuntimeException("Payments can only be recorded for APPROVED or PROCESSING pay runs");
        }

        List<PayRunEmployee> employees;
        if (employeeIds == null || employeeIds.isEmpty()) {
            employees = payRunEmployeeRepository.findByPayRunId(payRunId);
        } else {
            employees = payRunEmployeeRepository.findAllById(employeeIds);
        }

        for (PayRunEmployee pre : employees) {
            if (pre.getPayRun().getId().equals(payRunId)) {
                pre.setStatus(PayRunEmployeeStatus.PAID);
                pre.setPaymentStatus(PayRun.PaymentStatus.PAID);
                pre.setPaymentDate(paymentDate.atStartOfDay());
                payRunEmployeeRepository.save(pre);
            }
        }

        // Update pay run status
        List<PayRunEmployee> allEmployees = payRunEmployeeRepository.findByPayRunId(payRunId);
        long paidCount = allEmployees.stream().filter(e -> e.getStatus() == PayRunEmployeeStatus.PAID).count();

        if (paidCount == allEmployees.size()) {
            payRun.setStatus(PayRunStatus.COMPLETED);
            payRun.setPaymentStatus(PayRun.PaymentStatus.PAID);
        } else if (paidCount > 0) {
            payRun.setStatus(PayRunStatus.PROCESSING);
            payRun.setPaymentStatus(PayRun.PaymentStatus.PARTIALLY_PAID);
        }

        payRun.setPaymentDate(paymentDate);
        payRun = payRunRepository.save(payRun);

        return convertToDTO(payRun);
    }

    @Transactional
    public PayRunDTO completePayRun(Long payRunId, Long tenantId) {
        log.info("Completing pay run: {}", payRunId);

        PayRun payRun = payRunRepository.findByIdAndTenantId(payRunId, tenantId)
                .orElseThrow(() -> new RuntimeException("Pay run not found"));

        // Allow completing from DRAFT (after calculation) or APPROVED status
        if (payRun.getStatus() != PayRunStatus.APPROVED && payRun.getStatus() != PayRunStatus.DRAFT) {
            throw new RuntimeException("Pay run must be DRAFT (calculated) or APPROVED before completing");
        }

        // Mark all employees as paid
        List<PayRunEmployee> employees = payRunEmployeeRepository.findByPayRunId(payRunId);
        for (PayRunEmployee pre : employees) {
            pre.setStatus(PayRunEmployeeStatus.PAID);
            pre.setPaymentStatus(PayRun.PaymentStatus.PAID);
            pre.setPaymentDate(LocalDateTime.now());
            payRunEmployeeRepository.save(pre);
        }

        payRun.setStatus(PayRunStatus.COMPLETED);
        payRun.setPaymentStatus(PayRun.PaymentStatus.PAID);
        payRun.setPaymentDate(LocalDate.now());
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

        log.info("Status of pay run {} is {}", payRunId, payRun.getStatus());

        // Can only delete DRAFT, CANCELLED, or COMPLETED pay runs
        if (payRun.getStatus() == PayRunStatus.APPROVED || payRun.getStatus() == PayRunStatus.CALCULATING) {
            throw new RuntimeException("Cannot delete pay runs in APPROVED or CALCULATING status. Cancel it first.");
        }

        // Delete all pay run employees first
        List<PayRunEmployee> employees = payRunEmployeeRepository.findByPayRunId(payRunId);

        // Delete associated one-time components to prevent FK violation
        if (!employees.isEmpty()) {
            List<Long> employeeIds = employees.stream().map(PayRunEmployee::getId).collect(Collectors.toList());
            oneTimeComponentRepository.deleteByPayRunEmployeeIdIn(employeeIds);
            log.info("Deleted one-time components for {} employees", employeeIds.size());

            // Delete associated payslips
            payslipRepository.deleteByPayRunEmployeeIdIn(employeeIds);
            log.info("Deleted payslips for {} employees", employeeIds.size());
        }

        // Unlink reimbursements processed in this pay run
        List<Reimbursement> reimbursements = reimbursementRepository.findByPaidInPayrollId(payRunId);
        for (Reimbursement reimbursement : reimbursements) {
            reimbursement.setPaidInPayrollId(null);
            reimbursement.setPaidAt(null);
            reimbursement.setStatus("APPROVED"); // Revert from PAID to APPROVED
            reimbursementRepository.save(reimbursement);
            log.info("Unlinked reimbursement {} from pay run {}", reimbursement.getId(), payRunId);
        }

        // Zoho Flow: Release any pulled arrears so they can be picked up by a future
        // pay run
        skipRepository.releaseArrears(payRunId);
        log.info("Released arrears for pay run {}", payRunId);

        payRunEmployeeRepository.deleteAll(employees);

        // Delete associated skips created in this pay run
        skipRepository.deleteByPayRunId(payRunId);

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
            pre.setDaysWorked((int) Math.round(pre.getWorkingDays() - request.getLopDays().doubleValue()));
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
        dto.setPayRunType(entity.getPayRunType().name());
        dto.setPaymentStatus(entity.getPaymentStatus() != null ? entity.getPaymentStatus().name() : null);
        dto.setPaymentDate(entity.getPaymentDate());
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
        dto.setIsSkipped(entity.getIsSkipped());
        dto.setSkipReason(entity.getSkipReason());
        dto.setNotes(entity.getNotes());
        dto.setPaymentStatus(entity.getPaymentStatus() != null ? entity.getPaymentStatus().name() : null);
        dto.setPaymentDate(entity.getPaymentDate());
        dto.setIsWithheld(entity.getIsWithheld());

        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());

        return dto;
    }

    public String generateBankAdvice(Long payRunId, Long tenantId) {
        PayRun payRun = payRunRepository.findByIdAndTenantId(payRunId, tenantId)
                .orElseThrow(() -> new RuntimeException("Pay run not found"));

        List<PayRunEmployee> employees = payRunEmployeeRepository.findByPayRunId(payRunId).stream()
                .filter(e -> e.getStatus() == PayRunEmployeeStatus.PAID)
                .collect(Collectors.toList());

        StringBuilder csv = new StringBuilder();
        csv.append("Employee Name,Employee ID,Bank Account,Bank Name,IFSC,Net Pay\n");

        for (PayRunEmployee pre : employees) {
            Employee emp = pre.getEmployee();
            csv.append(String.format("%s,%s,%s,%s,%s,%s\n",
                    emp.getFirstName() + " " + emp.getLastName(),
                    emp.getEmployeeId(),
                    emp.getAccountNumber() != null ? emp.getAccountNumber() : "",
                    emp.getBankName() != null ? emp.getBankName() : "",
                    emp.getIfscCode() != null ? emp.getIfscCode() : "",
                    pre.getNetSalary()));
        }

        return csv.toString();
    }

    // Helper: check if arrears-related tables exist before querying them
    private boolean arrearsTablesAvailable() {
        try {
            Boolean skipsExists = (Boolean) entityManager.createNativeQuery(
                    "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='pay_run_employee_skips')")
                    .getSingleResult();
            Boolean otcExists = (Boolean) entityManager.createNativeQuery(
                    "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='pay_run_one_time_components')")
                    .getSingleResult();
            return Boolean.TRUE.equals(skipsExists) && Boolean.TRUE.equals(otcExists);
        } catch (Exception e) {
            log.warn("Failed to check arrears table existence: {}", e.getMessage());
            return false;
        }
    }
}
