package com.payroll.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PayslipDTO {

    private Long id;
    private String payslipNumber;
    private Long employeeId;
    private String employeeNumber;
    private String employeeName;
    private String designation;
    private String department;

    private LocalDate payPeriodStart;
    private LocalDate payPeriodEnd;
    private LocalDate payDate;

    // Earnings
    private BigDecimal basicSalary;
    private BigDecimal hra;
    private BigDecimal conveyanceAllowance;
    private BigDecimal fixedAllowance;
    private BigDecimal otherEarnings;
    private BigDecimal grossSalary;

    // Deductions
    private BigDecimal pfEmployee;
    private BigDecimal esiEmployee;
    private BigDecimal professionalTax;
    private BigDecimal tds;
    private BigDecimal lopDeduction;
    private BigDecimal otherDeductions;
    private BigDecimal totalDeductions;

    // Net pay
    private BigDecimal netSalary;

    // Attendance
    private Integer workingDays;
    private Integer daysWorked;
    private Integer lopDays;

    // PDF and email status
    private String pdfPath;
    private LocalDateTime pdfGeneratedAt;
    private Boolean emailSent;
    private LocalDateTime emailSentAt;
    private String status;

    private LocalDateTime createdAt;

    // Company details for payslip
    private String companyName;
    private String companyAddress;
    private String companyLogo;
}
