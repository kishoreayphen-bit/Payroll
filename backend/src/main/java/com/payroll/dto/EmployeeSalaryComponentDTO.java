package com.payroll.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeSalaryComponentDTO {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private Long componentId;
    private String componentName;
    private String componentCode;
    private String componentType;
    private String calculationType;
    private BigDecimal value;
    private BigDecimal calculatedAmount;
    private LocalDate effectiveFrom;
    private LocalDate effectiveTo;
    private Boolean isActive;
    private String remarks;
}
