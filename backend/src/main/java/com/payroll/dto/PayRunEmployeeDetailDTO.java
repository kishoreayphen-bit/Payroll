package com.payroll.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PayRunEmployeeDetailDTO {

    private Long id;
    private Long employeeId;
    private String employeeName;
    private String employeeNumber;

    // Basic salary components
    private BigDecimal basicSalary;
    private BigDecimal hra;
    private BigDecimal conveyanceAllowance;
    private BigDecimal fixedAllowance;
    private BigDecimal otherEarnings;

    // One-time components
    private List<OneTimeComponentDTO> oneTimeEarnings;
    private List<OneTimeComponentDTO> oneTimeDeductions;

    // Total earnings
    private BigDecimal grossSalary;

    // Attendance
    private Integer workingDays;
    private Integer daysWorked;
    private Integer leaveDays;
    private java.math.BigDecimal lopDays;
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
    private Boolean isSkipped;
    private String skipReason;
    private Boolean payslipGenerated;
    private Boolean payslipSent;
    private String paymentStatus;
    private java.time.LocalDateTime paymentDate;
    private Boolean isWithheld;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OneTimeComponentDTO {
        private Long id;
        private String componentName;
        private BigDecimal amount;
        private Boolean isTaxable;
        private String notes;
    }
}
