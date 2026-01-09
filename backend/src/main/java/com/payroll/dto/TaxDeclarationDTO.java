package com.payroll.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaxDeclarationDTO {

    private Long id;
    private Long employeeId;
    private String employeeName;
    private Long tenantId;
    private String financialYear;
    private String taxRegime;

    // Section 80C
    private BigDecimal section80cPpf;
    private BigDecimal section80cElss;
    private BigDecimal section80cNsc;
    private BigDecimal section80cLifeInsurance;
    private BigDecimal section80cTuitionFees;
    private BigDecimal section80cHomeLoanPrincipal;
    private BigDecimal section80cSukanyaSamriddhi;
    private BigDecimal section80cFixedDeposit;
    private BigDecimal section80cOthers;
    private BigDecimal total80C;

    // Section 80CCD (NPS)
    private BigDecimal section80ccd1bNps;
    private BigDecimal section80ccd2EmployerNps;

    // Section 80D (Health Insurance)
    private BigDecimal section80dSelfFamily;
    private BigDecimal section80dParents;
    private BigDecimal section80dPreventiveCheckup;
    private BigDecimal total80D;

    // Section 80E
    private BigDecimal section80eEducationLoan;

    // Section 80G
    private BigDecimal section80gDonations;

    // Section 80TTA
    private BigDecimal section80ttaInterest;

    // Section 80U/80DD/80DDB
    private BigDecimal section80uDisability;
    private BigDecimal section80ddDependentDisability;
    private BigDecimal section80ddbMedical;

    // Section 80EE/24
    private BigDecimal section80eeHomeLoanInterest;
    private BigDecimal section24HomeLoanInterest;

    // HRA Details
    private BigDecimal rentPaidAnnual;
    private String landlordName;
    private String landlordPan;
    private String rentalAddress;
    private Boolean isMetroCity;

    // Other Income
    private BigDecimal otherIncomeInterest;
    private BigDecimal otherIncomeRental;
    private BigDecimal otherIncomeMisc;

    // Previous Employer
    private BigDecimal previousEmployerIncome;
    private BigDecimal previousEmployerTds;
    private BigDecimal previousEmployerPf;
    private BigDecimal previousEmployerPt;

    // Status
    private String status;
    private LocalDateTime submittedAt;
    private LocalDateTime verifiedAt;

    // Calculated fields
    private BigDecimal totalDeductions;
    private BigDecimal estimatedTaxableIncome;
    private BigDecimal estimatedTax;
    private BigDecimal monthlyTds;
}
