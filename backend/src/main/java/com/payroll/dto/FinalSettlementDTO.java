package com.payroll.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinalSettlementDTO {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private String employeeCode;
    private Long organizationId;
    
    private LocalDate settlementDate;
    private LocalDate lastWorkingDay;
    
    // Salary components
    private BigDecimal pendingSalary;
    private BigDecimal proratedSalary;
    private Integer workedDays;
    private Integer totalDaysInMonth;
    
    // Leave encashment
    private BigDecimal leaveBalanceDays;
    private BigDecimal leaveEncashmentAmount;
    
    // Gratuity
    private Boolean isGratuityEligible;
    private BigDecimal yearsOfService;
    private BigDecimal gratuityAmount;
    
    // Notice period
    private Integer noticePeriodDays;
    private Integer noticePeriodServedDays;
    private BigDecimal noticePayRecovery;
    private BigDecimal noticePayPayable;
    
    // Bonus and other components
    private BigDecimal bonusPayable;
    private BigDecimal otherEarnings;
    
    // Deductions
    private BigDecimal pendingLoans;
    private BigDecimal otherDeductions;
    private BigDecimal tdsOnSettlement;
    
    // Totals
    private BigDecimal totalEarnings;
    private BigDecimal totalDeductions;
    private BigDecimal netSettlementAmount;
    
    // Status
    private String status;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime approvedAt;
    private LocalDateTime paidAt;
    private String paymentReference;
}
