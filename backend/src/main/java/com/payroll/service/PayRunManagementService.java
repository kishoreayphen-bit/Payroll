package com.payroll.service;

import com.payroll.dto.*;
import com.payroll.entity.*;
import com.payroll.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PayRunManagementService {

        private final PayRunRepository payRunRepository;
        private final PayRunEmployeeRepository payRunEmployeeRepository;
        private final PayRunEmployeeSkipRepository skipRepository;
        private final PayRunOneTimeComponentRepository componentRepository;

        /**
         * Skip an employee from pay run
         */
        @Transactional
        public void skipEmployee(Long payRunId, Long employeeId, SkipEmployeeRequest request, Long tenantId,
                        Long userId) {
                // Validate pay run
                PayRun payRun = payRunRepository.findByIdAndTenantId(payRunId, tenantId)
                                .orElseThrow(() -> new RuntimeException("Pay run not found"));

                if (payRun.getStatus() == PayRun.PayRunStatus.COMPLETED) {
                        throw new RuntimeException("Cannot skip employee from completed pay run");
                }

                // Find pay run employee
                PayRunEmployee payRunEmployee = payRunEmployeeRepository
                                .findByPayRunIdAndEmployeeIdAndPayRunTenantId(payRunId, employeeId, tenantId)
                                .orElseThrow(() -> new RuntimeException("Employee not found in pay run"));

                if (payRunEmployee.getPayslipGenerated()) {
                        throw new RuntimeException("Cannot skip employee - payslip already generated");
                }

                // Create skip record
                PayRunEmployeeSkip skip = new PayRunEmployeeSkip();
                skip.setPayRunId(payRunId);
                skip.setEmployeeId(employeeId);
                skip.setSkipType(PayRunEmployeeSkip.SkipType.valueOf(request.getSkipType()));
                skip.setReason(request.getReason());
                skip.setSkippedBy(userId);
                skip.setTenantId(tenantId);
                // Update pay run employee
                payRunEmployee.setIsSkipped(true);
                payRunEmployee.setSkipReason(request.getReason());
                payRunEmployee.setStatus(PayRunEmployee.PayRunEmployeeStatus.EXCLUDED);

                // If paying as arrears, store the current net pay amount to be carried over
                if (PayRunEmployeeSkip.SkipType.PAY_AS_ARREARS.name().equals(request.getSkipType())) {
                        skip.setCarriedOverAmount(payRunEmployee.getNetSalary());
                }

                skipRepository.save(skip);
                payRunEmployeeRepository.save(payRunEmployee);

                // Recalculate pay run totals
                recalculatePayRunTotals(payRun);

                log.info("Employee {} skipped from pay run {} with type: {}", employeeId, payRunId,
                                request.getSkipType());
        }

        /**
         * Unskip an employee (revert skip action)
         */
        @Transactional
        public void unskipEmployee(Long payRunId, Long employeeId, Long tenantId) {
                PayRunEmployee payRunEmployee = payRunEmployeeRepository
                                .findByPayRunIdAndEmployeeIdAndPayRunTenantId(payRunId, employeeId, tenantId)
                                .orElseThrow(() -> new RuntimeException("Employee not found in pay run"));

                // Remove skip record
                skipRepository.findByPayRunIdAndEmployeeIdAndTenantId(payRunId, employeeId, tenantId)
                                .ifPresent(skipRepository::delete);

                // Update pay run employee
                payRunEmployee.setIsSkipped(false);
                payRunEmployee.setSkipReason(null);
                payRunEmployee.setStatus(PayRunEmployee.PayRunEmployeeStatus.PENDING);
                payRunEmployeeRepository.save(payRunEmployee);

                // Recalculate pay run totals
                PayRun payRun = payRunRepository.findByIdAndTenantId(payRunId, tenantId)
                                .orElseThrow(() -> new RuntimeException("Pay run not found"));
                recalculatePayRunTotals(payRun);

                log.info("Employee {} unskipped from pay run {}", employeeId, payRunId);
        }

        /**
         * Add one-time component (earning or deduction)
         */
        @Transactional
        public void addOneTimeComponent(Long payRunId, Long employeeId, OneTimeComponentRequest request,
                        Long tenantId, Long userId) {
                PayRunEmployee payRunEmployee = payRunEmployeeRepository
                                .findByPayRunIdAndEmployeeIdAndPayRunTenantId(payRunId, employeeId, tenantId)
                                .orElseThrow(() -> new RuntimeException("Employee not found in pay run"));

                if (payRunEmployee.getIsSkipped()) {
                        throw new RuntimeException("Cannot add component to skipped employee");
                }

                // Create one-time component
                PayRunOneTimeComponent component = new PayRunOneTimeComponent();
                component.setPayRunEmployeeId(payRunEmployee.getId());
                component.setComponentType(PayRunOneTimeComponent.ComponentType.valueOf(request.getComponentType()));
                component.setComponentName(request.getComponentName());
                component.setAmount(request.getAmount());
                component.setIsTaxable(request.getIsTaxable());
                component.setNotes(request.getNotes());
                component.setCreatedBy(userId);
                component.setTenantId(tenantId);
                componentRepository.save(component);

                // Recalculate employee salary
                recalculateEmployeeSalary(payRunEmployee);

                log.info("Added one-time {} '{}' of {} to employee {} in pay run {}",
                                request.getComponentType(), request.getComponentName(), request.getAmount(),
                                employeeId, payRunId);
        }

        /**
         * Delete one-time component
         */
        @Transactional
        public void deleteOneTimeComponent(Long componentId, Long tenantId) {
                PayRunOneTimeComponent component = componentRepository.findById(componentId)
                                .orElseThrow(() -> new RuntimeException("Component not found"));

                if (!component.getTenantId().equals(tenantId)) {
                        throw new RuntimeException("Unauthorized");
                }

                PayRunEmployee payRunEmployee = payRunEmployeeRepository.findById(component.getPayRunEmployeeId())
                                .orElseThrow(() -> new RuntimeException("Pay run employee not found"));

                componentRepository.delete(component);

                // Recalculate employee salary
                recalculateEmployeeSalary(payRunEmployee);

                log.info("Deleted one-time component {}", componentId);
        }

        /**
         * Add LOP (Loss of Pay) days
         */
        @Transactional
        public void addLOP(Long payRunId, Long employeeId, AddLOPRequest request, Long tenantId) {
                PayRunEmployee payRunEmployee = payRunEmployeeRepository
                                .findByPayRunIdAndEmployeeIdAndPayRunTenantId(payRunId, employeeId, tenantId)
                                .orElseThrow(() -> new RuntimeException("Employee not found in pay run"));

                if (payRunEmployee.getIsSkipped()) {
                        throw new RuntimeException("Cannot add LOP to skipped employee");
                }

                if (request.getLopDays().compareTo(BigDecimal.ZERO) < 0) { // Changed from request.getLopDays() < 0
                        throw new RuntimeException("LOP days cannot be negative");
                }

                if (payRunEmployee.getWorkingDays() == null || request.getLopDays()
                                .compareTo(BigDecimal.valueOf(payRunEmployee.getWorkingDays())) > 0) {
                        throw new RuntimeException("LOP days cannot exceed working days");
                }

                // Update LOP
                payRunEmployee.setLopDays(request.getLopDays());
                // Update days worked
                if (payRunEmployee.getWorkingDays() != null) {
                        payRunEmployee.setDaysWorked((int) Math
                                        .round(payRunEmployee.getWorkingDays() - request.getLopDays().doubleValue()));
                }

                // Recalculate salary with LOP
                recalculateEmployeeSalary(payRunEmployee); // Changed call signature

                log.info("Added {} LOP days to employee {} in pay run {}", request.getLopDays(), employeeId, payRunId);
        }

        /**
         * Get detailed employee information in pay run
         */
        @Transactional(readOnly = true)
        public PayRunEmployeeDetailDTO getEmployeeDetail(Long payRunId, Long employeeId, Long tenantId) {
                PayRunEmployee payRunEmployee = payRunEmployeeRepository
                                .findByPayRunIdAndEmployeeIdAndPayRunTenantId(payRunId, employeeId, tenantId)
                                .orElseThrow(() -> new RuntimeException("Employee not found in pay run"));

                Employee employee = payRunEmployee.getEmployee();

                // Get one-time components
                List<PayRunOneTimeComponent> components = componentRepository
                                .findByPayRunEmployeeId(payRunEmployee.getId());

                List<PayRunEmployeeDetailDTO.OneTimeComponentDTO> earnings = components.stream()
                                .filter(c -> c.getComponentType() == PayRunOneTimeComponent.ComponentType.EARNING)
                                .map(c -> new PayRunEmployeeDetailDTO.OneTimeComponentDTO(
                                                c.getId(), c.getComponentName(), c.getAmount(), c.getIsTaxable(),
                                                c.getNotes()))
                                .collect(Collectors.toList());

                List<PayRunEmployeeDetailDTO.OneTimeComponentDTO> deductions = components.stream()
                                .filter(c -> c.getComponentType() == PayRunOneTimeComponent.ComponentType.DEDUCTION)
                                .map(c -> new PayRunEmployeeDetailDTO.OneTimeComponentDTO(
                                                c.getId(), c.getComponentName(), c.getAmount(), c.getIsTaxable(),
                                                c.getNotes()))
                                .collect(Collectors.toList());

                // Build DTO
                PayRunEmployeeDetailDTO dto = new PayRunEmployeeDetailDTO();
                dto.setId(payRunEmployee.getId());
                dto.setEmployeeId(employee.getId());
                dto.setEmployeeName(employee.getFullName());
                dto.setEmployeeNumber(employee.getEmployeeId());

                dto.setBasicSalary(payRunEmployee.getBasicSalary());
                dto.setHra(payRunEmployee.getHra());
                dto.setConveyanceAllowance(payRunEmployee.getConveyanceAllowance());
                dto.setFixedAllowance(payRunEmployee.getFixedAllowance());
                dto.setOtherEarnings(payRunEmployee.getOtherEarnings());

                dto.setOneTimeEarnings(earnings);
                dto.setOneTimeDeductions(deductions);
                dto.setGrossSalary(payRunEmployee.getGrossSalary());

                dto.setWorkingDays(payRunEmployee.getWorkingDays());
                dto.setDaysWorked(payRunEmployee.getDaysWorked());
                dto.setLeaveDays(payRunEmployee.getLeaveDays());
                dto.setLopDays(payRunEmployee.getLopDays());
                dto.setLopDeduction(payRunEmployee.getLopDeduction());

                dto.setPfEmployee(payRunEmployee.getPfEmployee());
                dto.setEsiEmployee(payRunEmployee.getEsiEmployee());
                dto.setProfessionalTax(payRunEmployee.getProfessionalTax());
                dto.setTds(payRunEmployee.getTds());
                dto.setOtherDeductions(payRunEmployee.getOtherDeductions());
                dto.setTotalDeductions(payRunEmployee.getTotalDeductions());

                dto.setPfEmployer(payRunEmployee.getPfEmployer());
                dto.setEsiEmployer(payRunEmployee.getEsiEmployer());
                dto.setTotalEmployerContribution(payRunEmployee.getTotalEmployerContribution());

                dto.setNetSalary(payRunEmployee.getNetSalary());
                dto.setStatus(payRunEmployee.getStatus().name());
                dto.setIsSkipped(payRunEmployee.getIsSkipped());
                dto.setSkipReason(payRunEmployee.getSkipReason());
                dto.setPayslipGenerated(payRunEmployee.getPayslipGenerated());
                dto.setPayslipSent(payRunEmployee.getPayslipSent());

                return dto;
        }

        /**
         * Withhold an employee's salary
         */
        @Transactional
        public void withholdSalary(Long payRunId, Long employeeId, Long tenantId) {
                PayRunEmployee payRunEmployee = payRunEmployeeRepository
                                .findByPayRunIdAndEmployeeIdAndPayRunTenantId(payRunId, employeeId, tenantId)
                                .orElseThrow(() -> new RuntimeException("Employee not found in pay run"));

                if (payRunEmployee.getStatus() == PayRunEmployee.PayRunEmployeeStatus.PAID) {
                        throw new RuntimeException("Cannot withhold salary - already paid");
                }

                payRunEmployee.setIsWithheld(true);
                payRunEmployee.setStatus(PayRunEmployee.PayRunEmployeeStatus.ON_HOLD);
                payRunEmployeeRepository.save(payRunEmployee);

                log.info("Salary withheld for employee {} in pay run {}", employeeId, payRunId);
        }

        /**
         * Release a withheld salary
         */
        @Transactional
        public void releaseSalary(Long payRunId, Long employeeId, Long tenantId) {
                PayRunEmployee payRunEmployee = payRunEmployeeRepository
                                .findByPayRunIdAndEmployeeIdAndPayRunTenantId(payRunId, employeeId, tenantId)
                                .orElseThrow(() -> new RuntimeException("Employee not found in pay run"));

                if (!Boolean.TRUE.equals(payRunEmployee.getIsWithheld())) {
                        throw new RuntimeException("Salary is not withheld for this employee");
                }

                payRunEmployee.setIsWithheld(false);
                payRunEmployee.setStatus(PayRunEmployee.PayRunEmployeeStatus.CALCULATED);
                payRunEmployeeRepository.save(payRunEmployee);

                log.info("Salary released for employee {} in pay run {}", employeeId, payRunId);
        }

        /**
         * Recalculate employee salary including one-time components and LOP
         */
        private void recalculateEmployeeSalary(PayRunEmployee employee) {
                // Get one-time components
                List<PayRunOneTimeComponent> components = componentRepository.findByPayRunEmployeeId(employee.getId());

                // Calculate one-time earnings
                BigDecimal oneTimeEarnings = components.stream()
                                .filter(c -> c.getComponentType() == PayRunOneTimeComponent.ComponentType.EARNING)
                                .map(PayRunOneTimeComponent::getAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                // Calculate one-time deductions
                BigDecimal oneTimeDeductions = components.stream()
                                .filter(c -> c.getComponentType() == PayRunOneTimeComponent.ComponentType.DEDUCTION)
                                .map(PayRunOneTimeComponent::getAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                // Calculate LOP deduction
                if (employee.getLopDays() != null && employee.getLopDays().compareTo(BigDecimal.ZERO) > 0) {
                        BigDecimal perDaySalary = employee.getBasicSalary()
                                        .divide(BigDecimal.valueOf(employee.getWorkingDays()), 2, RoundingMode.HALF_UP);
                        employee.setLopDeduction(
                                        perDaySalary.multiply(employee.getLopDays()).setScale(2, RoundingMode.HALF_UP));
                } else {
                        employee.setLopDeduction(BigDecimal.ZERO);
                }

                // Update other earnings/deductions
                employee.setOtherEarnings(oneTimeEarnings);
                employee.setOtherDeductions(oneTimeDeductions);

                // Recalculate totals
                employee.calculateTotals();
                payRunEmployeeRepository.save(employee);

                // Update pay run totals
                PayRun payRun = employee.getPayRun();
                recalculatePayRunTotals(payRun);
        }

        /**
         * Recalculate pay run totals
         */
        private void recalculatePayRunTotals(PayRun payRun) {
                List<PayRunEmployee> employees = payRunEmployeeRepository.findByPayRunIdAndPayRunTenantId(
                                payRun.getId(), payRun.getTenantId());

                // Filter out skipped employees
                List<PayRunEmployee> activeEmployees = employees.stream()
                                .filter(e -> !Boolean.TRUE.equals(e.getIsSkipped()))
                                .collect(Collectors.toList());

                BigDecimal totalGross = activeEmployees.stream()
                                .map(PayRunEmployee::getGrossSalary)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal totalDeductions = activeEmployees.stream()
                                .map(PayRunEmployee::getTotalDeductions)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal totalNet = activeEmployees.stream()
                                .map(PayRunEmployee::getNetSalary)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal totalEmployerContrib = activeEmployees.stream()
                                .map(PayRunEmployee::getTotalEmployerContribution)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                payRun.setTotalGrossPay(totalGross);
                payRun.setTotalDeductions(totalDeductions);
                payRun.setTotalNetPay(totalNet);
                payRun.setTotalEmployerContributions(totalEmployerContrib);
                payRun.setEmployeeCount(activeEmployees.size());

                payRunRepository.save(payRun);
        }
}
