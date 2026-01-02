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
        BigDecimal totalEarnings = earnings.stream()
                .map(SalaryBreakdownDTO.ComponentBreakdown::getCalculatedAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalDeductions = deductions.stream()
                .map(SalaryBreakdownDTO.ComponentBreakdown::getCalculatedAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        breakdown.setTotalEarnings(totalEarnings);
        breakdown.setTotalDeductions(totalDeductions);
        breakdown.setGrossSalary(totalEarnings);
        breakdown.setNetSalary(totalEarnings.subtract(totalDeductions));

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
}
