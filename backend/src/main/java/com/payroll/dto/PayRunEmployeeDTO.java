package com.payroll.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PayRunEmployeeDTO {

    private Long id;
    private Long payRunId;
    private Long employeeId;
    private String employeeNumber;
    private String employeeName;
    private String designation;
    private String department;

    // Earnings
    private BigDecimal basicSalary;
    private BigDecimal hra;
    private BigDecimal conveyanceAllowance;
    private BigDecimal fixedAllowance;
    private BigDecimal otherEarnings;
    private BigDecimal grossSalary;

    // Attendance
    private Integer workingDays;
    private Integer daysWorked;
    private Integer leaveDays;
    private Integer lopDays;
    private BigDecimal lopDeduction;

    // Deductions
    private BigDecimal pfEmployee;
    private BigDecimal esiEmployee;
    private BigDecimal professionalTax;
    private BigDecimal tds;
    private BigDecimal otherDeductions;
    private BigDecimal totalDeductions;

    // Employer contributions
    private BigDecimal pfEmployer;
    private BigDecimal esiEmployer;
    private BigDecimal totalEmployerContribution;

    // Net pay
    private BigDecimal netSalary;

    // Status
    private String status;
    private Boolean payslipGenerated;
    private Boolean payslipSent;
    private String notes;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Request DTO for updating individual employee in pay run
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        private Integer lopDays;
        private BigDecimal otherEarnings;
        private BigDecimal otherDeductions;
        private String notes;
        private String status;
    }
}
