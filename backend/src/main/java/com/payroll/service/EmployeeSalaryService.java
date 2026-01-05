package com.payroll.service;

import com.payroll.dto.EmployeeSalaryComponentDTO;
import com.payroll.dto.SalaryBreakdownDTO;
import com.payroll.entity.Employee;
import com.payroll.entity.EmployeeSalaryComponent;
import com.payroll.entity.SalaryComponent;
import com.payroll.enums.CalculationType;
import com.payroll.enums.ComponentType;
import com.payroll.repository.EmployeeRepository;
import com.payroll.repository.EmployeeSalaryComponentRepository;
import com.payroll.repository.SalaryComponentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeSalaryService {

    private final EmployeeSalaryComponentRepository employeeSalaryComponentRepository;
    private final SalaryComponentRepository salaryComponentRepository;
    private final EmployeeRepository employeeRepository;
    private final ProfessionalTaxService professionalTaxService;

    @Transactional(readOnly = true)
    public List<EmployeeSalaryComponentDTO> getEmployeeComponents(Long employeeId) {
        return employeeSalaryComponentRepository.findByEmployeeIdAndIsActiveTrue(employeeId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EmployeeSalaryComponentDTO> getEmployeeComponentsOnDate(Long employeeId, LocalDate date) {
        return employeeSalaryComponentRepository.findActiveComponentsForEmployeeOnDate(employeeId, date)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public EmployeeSalaryComponentDTO assignComponentToEmployee(EmployeeSalaryComponentDTO dto) {
        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        SalaryComponent component = salaryComponentRepository.findById(dto.getComponentId())
                .orElseThrow(() -> new RuntimeException("Salary component not found"));

        // Check if component already assigned
        if (employeeSalaryComponentRepository.existsByEmployeeIdAndComponentIdAndIsActiveTrue(
                dto.getEmployeeId(), dto.getComponentId())) {
            throw new RuntimeException("Component already assigned to employee");
        }

        EmployeeSalaryComponent empComponent = new EmployeeSalaryComponent();
        empComponent.setEmployee(employee);
        empComponent.setComponent(component);
        empComponent.setValue(dto.getValue());
        empComponent.setEffectiveFrom(dto.getEffectiveFrom() != null ? dto.getEffectiveFrom() : LocalDate.now());
        empComponent.setEffectiveTo(dto.getEffectiveTo());
        empComponent.setIsActive(true);
        empComponent.setRemarks(dto.getRemarks());

        EmployeeSalaryComponent saved = employeeSalaryComponentRepository.save(empComponent);
        return convertToDTO(saved);
    }

    @Transactional
    public EmployeeSalaryComponentDTO updateEmployeeComponent(Long id, EmployeeSalaryComponentDTO dto) {
        EmployeeSalaryComponent empComponent = employeeSalaryComponentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee salary component not found"));

        empComponent.setValue(dto.getValue());
        empComponent.setEffectiveFrom(dto.getEffectiveFrom());
        empComponent.setEffectiveTo(dto.getEffectiveTo());
        empComponent.setIsActive(dto.getIsActive());
        empComponent.setRemarks(dto.getRemarks());

        EmployeeSalaryComponent updated = employeeSalaryComponentRepository.save(empComponent);
        return convertToDTO(updated);
    }

    @Transactional
    public void removeComponentFromEmployee(Long id) {
        EmployeeSalaryComponent empComponent = employeeSalaryComponentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee salary component not found"));

        // Soft delete
        empComponent.setIsActive(false);
        employeeSalaryComponentRepository.save(empComponent);
    }

    @Transactional(readOnly = true)
    public SalaryBreakdownDTO calculateSalaryBreakdown(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        List<EmployeeSalaryComponent> components = employeeSalaryComponentRepository
                .findActiveComponentsForEmployeeOnDate(employeeId, LocalDate.now());

        SalaryBreakdownDTO breakdown = new SalaryBreakdownDTO();
        breakdown.setEmployeeId(employeeId);
        breakdown.setEmployeeName(employee.getFullName());
        breakdown.setEmployeeId_code(employee.getEmployeeId());
        breakdown.setAnnualCtc(employee.getAnnualCtc());
        breakdown.setMonthlyCtc(employee.getAnnualCtc() != null
                ? employee.getAnnualCtc().divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO);

        // Calculate components
        Map<Long, BigDecimal> calculatedAmounts = new HashMap<>();
        List<SalaryBreakdownDTO.ComponentBreakdown> earnings = new ArrayList<>();
        List<SalaryBreakdownDTO.ComponentBreakdown> deductions = new ArrayList<>();

        // First pass: Calculate FIXED components
        for (EmployeeSalaryComponent empComp : components) {
            if (empComp.getComponent().getCalculationType() == CalculationType.FIXED) {
                BigDecimal amount = empComp.getValue();
                calculatedAmounts.put(empComp.getComponent().getId(), amount);

                SalaryBreakdownDTO.ComponentBreakdown cb = createComponentBreakdown(empComp, amount, amount);
                if (empComp.getComponent().getType() == ComponentType.EARNING) {
                    earnings.add(cb);
                } else {
                    deductions.add(cb);
                }
            }
        }

        // Second pass: Calculate PERCENTAGE components
        for (EmployeeSalaryComponent empComp : components) {
            if (empComp.getComponent().getCalculationType() == CalculationType.PERCENTAGE) {
                BigDecimal baseAmount = getBaseAmount(empComp, calculatedAmounts, breakdown.getMonthlyCtc());
                BigDecimal amount = baseAmount.multiply(empComp.getValue()).divide(BigDecimal.valueOf(100), 2,
                        RoundingMode.HALF_UP);
                calculatedAmounts.put(empComp.getComponent().getId(), amount);

                SalaryBreakdownDTO.ComponentBreakdown cb = createComponentBreakdown(empComp, baseAmount, amount);
                if (empComp.getComponent().getType() == ComponentType.EARNING) {
                    earnings.add(cb);
                } else {
                    deductions.add(cb);
                }
            }
        }

        breakdown.setEarnings(earnings);
        breakdown.setDeductions(deductions);

        // Calculate totals
        // Calculate totals from COMPONENTS only
        BigDecimal componentsEarnings = earnings.stream()
                .map(SalaryBreakdownDTO.ComponentBreakdown::getCalculatedAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate REAL Gross Salary (Base Structure + Components)
        BigDecimal baseStructureEarnings = (employee.getBasicMonthly() != null ? employee.getBasicMonthly()
                : BigDecimal.ZERO)
                .add(employee.getHraMonthly() != null ? employee.getHraMonthly() : BigDecimal.ZERO)
                .add(employee.getFixedAllowanceMonthly() != null ? employee.getFixedAllowanceMonthly()
                        : BigDecimal.ZERO);

        BigDecimal grossSalary = baseStructureEarnings.add(componentsEarnings);

        // Calculate Professional Tax
        // Check if PT was found in components and Remove it (to replace with
        // Virtual/Verified one)
        deductions.removeIf(d -> {
            String cCode = d.getComponentCode() != null ? d.getComponentCode().toLowerCase() : "";
            String cName = d.getComponentName() != null ? d.getComponentName().toLowerCase() : "";
            return cCode.equals("pt") || cCode.equals("ptax") || cCode.equals("prof_tax")
                    || cName.contains("professional tax");
        });

        // Always add Virtual PT if enabled (Forces correct view)
        if (employee.getProfessionalTax() != null && employee.getProfessionalTax()) {
            // Virtual: Calculate and add
            BigDecimal ptAmount = professionalTaxService.calculatePT(employee, grossSalary);

            // Allow 0 value execution so user sees it is enabled
            if (ptAmount != null && ptAmount.compareTo(BigDecimal.ZERO) >= 0) {
                SalaryBreakdownDTO.ComponentBreakdown virtualPt = new SalaryBreakdownDTO.ComponentBreakdown();
                virtualPt.setComponentName("Professional Tax (Virtual)");
                virtualPt.setComponentCode("PT");
                virtualPt.setCalculationType("FIXED");
                virtualPt.setValue(ptAmount);
                virtualPt.setCalculatedAmount(ptAmount);
                virtualPt.setBaseAmount(grossSalary);
                virtualPt.setIsTaxable(false);
                virtualPt.setIsStatutory(true);

                deductions.add(virtualPt);
            }
        }

        BigDecimal totalEarnings = componentsEarnings; // Keep legacy variable

        BigDecimal totalDeductions = deductions.stream()
                .map(SalaryBreakdownDTO.ComponentBreakdown::getCalculatedAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        breakdown.setTotalEarnings(totalEarnings);
        breakdown.setTotalDeductions(totalDeductions);
        breakdown.setGrossSalary(grossSalary);
        breakdown.setNetSalary(grossSalary.subtract(totalDeductions));

        return breakdown;
    }

    private BigDecimal getBaseAmount(EmployeeSalaryComponent empComp, Map<Long, BigDecimal> calculatedAmounts,
            BigDecimal monthlyCtc) {
        if (empComp.getComponent().getBaseComponent() != null) {
            Long baseComponentId = empComp.getComponent().getBaseComponent().getId();
            return calculatedAmounts.getOrDefault(baseComponentId, BigDecimal.ZERO);
        }
        // If no base component, use monthly CTC
        return monthlyCtc;
    }

    private SalaryBreakdownDTO.ComponentBreakdown createComponentBreakdown(
            EmployeeSalaryComponent empComp, BigDecimal baseAmount, BigDecimal calculatedAmount) {
        SalaryBreakdownDTO.ComponentBreakdown cb = new SalaryBreakdownDTO.ComponentBreakdown();
        cb.setComponentId(empComp.getComponent().getId());
        cb.setComponentName(empComp.getComponent().getName());
        cb.setComponentCode(empComp.getComponent().getCode());
        cb.setCalculationType(empComp.getComponent().getCalculationType().name());
        cb.setValue(empComp.getValue());
        cb.setBaseAmount(baseAmount);
        cb.setCalculatedAmount(calculatedAmount);
        cb.setIsTaxable(empComp.getComponent().getIsTaxable());
        cb.setIsStatutory(empComp.getComponent().getIsStatutory());
        return cb;
    }

    private EmployeeSalaryComponentDTO convertToDTO(EmployeeSalaryComponent empComponent) {
        EmployeeSalaryComponentDTO dto = new EmployeeSalaryComponentDTO();
        dto.setId(empComponent.getId());
        dto.setEmployeeId(empComponent.getEmployee().getId());
        dto.setEmployeeName(empComponent.getEmployee().getFullName());
        dto.setComponentId(empComponent.getComponent().getId());
        dto.setComponentName(empComponent.getComponent().getName());
        dto.setComponentCode(empComponent.getComponent().getCode());
        dto.setComponentType(empComponent.getComponent().getType().name());
        dto.setCalculationType(empComponent.getComponent().getCalculationType().name());
        dto.setValue(empComponent.getValue());
        dto.setCalculatedAmount(empComponent.getCalculatedAmount());
        dto.setEffectiveFrom(empComponent.getEffectiveFrom());
        dto.setEffectiveTo(empComponent.getEffectiveTo());
        dto.setIsActive(empComponent.getIsActive());
        dto.setRemarks(empComponent.getRemarks());
        return dto;
    }

    @Transactional
    public void syncProfessionalTax(Employee employee) {
        // 1. Calculate Gross Salary (without Virtual PT)
        SalaryBreakdownDTO breakdown = calculateSalaryBreakdown(employee.getId());
        BigDecimal grossSalary = breakdown.getGrossSalary();

        // 2. Calculate Statutory PT Amount
        BigDecimal ptAmount = professionalTaxService.calculatePT(employee, grossSalary);

        // 3. Cleanup & Sync: Find ALL Active Components for Employee
        // Use repo method to find all, then filter in memory to identify PT variants
        List<EmployeeSalaryComponent> allComponents = employeeSalaryComponentRepository
                .findByEmployeeIdAndIsActiveTrue(employee.getId());

        boolean isEnabled = employee.getProfessionalTax() != null && employee.getProfessionalTax();
        boolean ptUpdated = false;

        // Iterate to find any component that looks like PT
        for (EmployeeSalaryComponent esc : allComponents) {
            SalaryComponent sc = esc.getComponent();
            String name = sc.getName() != null ? sc.getName().trim().toLowerCase() : "";
            String code = sc.getCode() != null ? sc.getCode().trim().toLowerCase() : "";
            boolean isPT = code.equals("pt") || code.equals("ptax") || code.equals("prof_tax")
                    || name.equals("professional tax") || name.contains("professional tax");

            if (isPT) {
                if (isEnabled) {
                    if (!ptUpdated) {
                        // Update the first valid PT found to the correct amount
                        esc.setValue(ptAmount);
                        employeeSalaryComponentRepository.save(esc);
                        ptUpdated = true;
                    } else {
                        // Deactivate duplicates
                        esc.setIsActive(false);
                        employeeSalaryComponentRepository.save(esc);
                    }
                } else {
                    // Disable: User disabled PT, so remove this component
                    esc.setIsActive(false);
                    employeeSalaryComponentRepository.save(esc);
                }
            }
        }

        // 4. If Enabled and NO PT component existed, create/assign the Standard One
        if (isEnabled && !ptUpdated) {
            // Find Master Component by Code "PT" or Name "Professional Tax" or from
            // Statutory list
            java.util.Optional<SalaryComponent> ptMasterOpt = java.util.Optional.empty();
            List<SalaryComponent> statutoryComponents = salaryComponentRepository
                    .findByOrganizationIdAndIsStatutoryTrueAndIsActiveTrue(employee.getOrganization().getId());

            for (SalaryComponent sc : statutoryComponents) {
                String cName = sc.getName() != null ? sc.getName().trim().toLowerCase() : "";
                String cCode = sc.getCode() != null ? sc.getCode().trim().toLowerCase() : "";
                if (cCode.equals("pt") || cCode.equals("ptax") || cCode.equals("prof_tax")
                        || cName.equals("professional tax") || cName.contains("professional tax")) {
                    ptMasterOpt = java.util.Optional.of(sc);
                    break;
                }
            }

            if (!ptMasterOpt.isPresent()) {
                // Check specifically by code if not found in statutory (edge case)
                ptMasterOpt = salaryComponentRepository
                        .findByOrganizationIdAndCode(employee.getOrganization().getId(), "PT");
            }

            if (!ptMasterOpt.isPresent()) {
                // Create standard PT component if missing
                SalaryComponent newPt = new SalaryComponent();
                newPt.setName("Professional Tax");
                newPt.setCode("PT");
                newPt.setOrganization(employee.getOrganization());
                newPt.setType(ComponentType.DEDUCTION);
                newPt.setCalculationType(CalculationType.FIXED);
                newPt.setIsTaxable(false);
                newPt.setIsStatutory(true);
                newPt.setIsActive(true);
                newPt = salaryComponentRepository.save(newPt);
                ptMasterOpt = java.util.Optional.of(newPt);
            }

            SalaryComponent ptMaster = ptMasterOpt.get();

            // Create new assignment
            EmployeeSalaryComponent esc = new EmployeeSalaryComponent();
            esc.setEmployee(employee);
            esc.setComponent(ptMaster);
            esc.setEffectiveFrom(LocalDate.now());
            esc.setIsActive(true);
            esc.setValue(ptAmount);
            employeeSalaryComponentRepository.save(esc);
        }
    }
}
