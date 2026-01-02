package com.payroll.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalaryBreakdownDTO {
    private Long employeeId;
    private String employeeName;
    private String employeeId_code;
    private BigDecimal annualCtc;
    private BigDecimal monthlyCtc;
    private List<ComponentBreakdown> earnings;
    private List<ComponentBreakdown> deductions;
    private BigDecimal totalEarnings;
    private BigDecimal totalDeductions;
    private BigDecimal grossSalary;
    private BigDecimal netSalary;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ComponentBreakdown {
        private Long componentId;
        private String componentName;
        private String componentCode;
        private String calculationType;
        private BigDecimal value;
        private BigDecimal baseAmount;
        private BigDecimal calculatedAmount;
        private Boolean isTaxable;
        private Boolean isStatutory;
    }
}
