package com.payroll.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaxCalculationDTO {

    private Long employeeId;
    private String employeeName;
    private String financialYear;
    private String taxRegime;

    // Income
    private BigDecimal grossSalary;
    private BigDecimal basicSalary;
    private BigDecimal hra;
    private BigDecimal specialAllowance;
    private BigDecimal otherIncome;
    private BigDecimal totalGrossIncome;

    // Exemptions
    private BigDecimal hraExemption;
    private BigDecimal standardDeduction;
    private BigDecimal professionalTax;

    // Deductions under Chapter VI-A
    private BigDecimal section80C;
    private BigDecimal section80CCD1B;
    private BigDecimal section80D;
    private BigDecimal section80E;
    private BigDecimal section80G;
    private BigDecimal section80TTA;
    private BigDecimal section24;
    private BigDecimal otherDeductions;
    private BigDecimal totalChapterVIADeductions;

    // Tax Calculation
    private BigDecimal totalTaxableIncome;
    private BigDecimal taxBeforeRebate;
    private BigDecimal rebate87A;
    private BigDecimal taxAfterRebate;
    private BigDecimal surcharge;
    private BigDecimal educationCess;
    private BigDecimal totalTaxLiability;

    // TDS Details
    private BigDecimal taxAlreadyPaid;
    private BigDecimal remainingTax;
    private Integer remainingMonths;
    private BigDecimal monthlyTds;

    // Tax Slabs Applied
    private List<TaxSlabDetail> taxSlabDetails;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TaxSlabDetail {
        private BigDecimal fromAmount;
        private BigDecimal toAmount;
        private BigDecimal rate;
        private BigDecimal taxableAmount;
        private BigDecimal taxAmount;
    }
}
