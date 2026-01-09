package com.payroll.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "tax_declarations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaxDeclaration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @Column(name = "financial_year", length = 10, nullable = false)
    private String financialYear;

    @Column(name = "tax_regime", length = 10)
    private String taxRegime = "NEW";

    // Section 80C (Max 1.5L)
    @Column(name = "section_80c_ppf", precision = 12, scale = 2)
    private BigDecimal section80cPpf = BigDecimal.ZERO;

    @Column(name = "section_80c_elss", precision = 12, scale = 2)
    private BigDecimal section80cElss = BigDecimal.ZERO;

    @Column(name = "section_80c_nsc", precision = 12, scale = 2)
    private BigDecimal section80cNsc = BigDecimal.ZERO;

    @Column(name = "section_80c_life_insurance", precision = 12, scale = 2)
    private BigDecimal section80cLifeInsurance = BigDecimal.ZERO;

    @Column(name = "section_80c_tuition_fees", precision = 12, scale = 2)
    private BigDecimal section80cTuitionFees = BigDecimal.ZERO;

    @Column(name = "section_80c_home_loan_principal", precision = 12, scale = 2)
    private BigDecimal section80cHomeLoanPrincipal = BigDecimal.ZERO;

    @Column(name = "section_80c_sukanya_samriddhi", precision = 12, scale = 2)
    private BigDecimal section80cSukanyaSamriddhi = BigDecimal.ZERO;

    @Column(name = "section_80c_fixed_deposit", precision = 12, scale = 2)
    private BigDecimal section80cFixedDeposit = BigDecimal.ZERO;

    @Column(name = "section_80c_others", precision = 12, scale = 2)
    private BigDecimal section80cOthers = BigDecimal.ZERO;

    // Section 80CCD (NPS)
    @Column(name = "section_80ccd_1b_nps", precision = 12, scale = 2)
    private BigDecimal section80ccd1bNps = BigDecimal.ZERO;

    @Column(name = "section_80ccd_2_employer_nps", precision = 12, scale = 2)
    private BigDecimal section80ccd2EmployerNps = BigDecimal.ZERO;

    // Section 80D (Health Insurance)
    @Column(name = "section_80d_self_family", precision = 12, scale = 2)
    private BigDecimal section80dSelfFamily = BigDecimal.ZERO;

    @Column(name = "section_80d_parents", precision = 12, scale = 2)
    private BigDecimal section80dParents = BigDecimal.ZERO;

    @Column(name = "section_80d_preventive_checkup", precision = 12, scale = 2)
    private BigDecimal section80dPreventiveCheckup = BigDecimal.ZERO;

    // Section 80E (Education Loan Interest)
    @Column(name = "section_80e_education_loan", precision = 12, scale = 2)
    private BigDecimal section80eEducationLoan = BigDecimal.ZERO;

    // Section 80G (Donations)
    @Column(name = "section_80g_donations", precision = 12, scale = 2)
    private BigDecimal section80gDonations = BigDecimal.ZERO;

    // Section 80TTA/TTB (Savings Interest)
    @Column(name = "section_80tta_interest", precision = 12, scale = 2)
    private BigDecimal section80ttaInterest = BigDecimal.ZERO;

    // Section 80U (Disability)
    @Column(name = "section_80u_disability", precision = 12, scale = 2)
    private BigDecimal section80uDisability = BigDecimal.ZERO;

    // Section 80DD (Dependent Disability)
    @Column(name = "section_80dd_dependent_disability", precision = 12, scale = 2)
    private BigDecimal section80ddDependentDisability = BigDecimal.ZERO;

    // Section 80DDB (Medical Treatment)
    @Column(name = "section_80ddb_medical", precision = 12, scale = 2)
    private BigDecimal section80ddbMedical = BigDecimal.ZERO;

    // Section 80EE/80EEA (Home Loan Interest - First time buyers)
    @Column(name = "section_80ee_home_loan_interest", precision = 12, scale = 2)
    private BigDecimal section80eeHomeLoanInterest = BigDecimal.ZERO;

    // Section 24 (Home Loan Interest)
    @Column(name = "section_24_home_loan_interest", precision = 12, scale = 2)
    private BigDecimal section24HomeLoanInterest = BigDecimal.ZERO;

    // HRA Exemption Details
    @Column(name = "rent_paid_annual", precision = 12, scale = 2)
    private BigDecimal rentPaidAnnual = BigDecimal.ZERO;

    @Column(name = "landlord_name")
    private String landlordName;

    @Column(name = "landlord_pan", length = 15)
    private String landlordPan;

    @Column(name = "rental_address", columnDefinition = "TEXT")
    private String rentalAddress;

    @Column(name = "is_metro_city")
    private Boolean isMetroCity = false;

    // Other Income
    @Column(name = "other_income_interest", precision = 12, scale = 2)
    private BigDecimal otherIncomeInterest = BigDecimal.ZERO;

    @Column(name = "other_income_rental", precision = 12, scale = 2)
    private BigDecimal otherIncomeRental = BigDecimal.ZERO;

    @Column(name = "other_income_misc", precision = 12, scale = 2)
    private BigDecimal otherIncomeMisc = BigDecimal.ZERO;

    // Previous Employer Details
    @Column(name = "previous_employer_income", precision = 12, scale = 2)
    private BigDecimal previousEmployerIncome = BigDecimal.ZERO;

    @Column(name = "previous_employer_tds", precision = 12, scale = 2)
    private BigDecimal previousEmployerTds = BigDecimal.ZERO;

    @Column(name = "previous_employer_pf", precision = 12, scale = 2)
    private BigDecimal previousEmployerPf = BigDecimal.ZERO;

    @Column(name = "previous_employer_pt", precision = 12, scale = 2)
    private BigDecimal previousEmployerPt = BigDecimal.ZERO;

    // Status
    @Column(name = "status", length = 20)
    private String status = "DRAFT"; // DRAFT, SUBMITTED, VERIFIED, LOCKED

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "verified_by")
    private Long verifiedBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.updatedAt == null) {
            this.updatedAt = LocalDateTime.now();
        }
    }

    // Helper method to calculate total 80C
    public BigDecimal getTotal80C() {
        BigDecimal total = BigDecimal.ZERO;
        if (section80cPpf != null) total = total.add(section80cPpf);
        if (section80cElss != null) total = total.add(section80cElss);
        if (section80cNsc != null) total = total.add(section80cNsc);
        if (section80cLifeInsurance != null) total = total.add(section80cLifeInsurance);
        if (section80cTuitionFees != null) total = total.add(section80cTuitionFees);
        if (section80cHomeLoanPrincipal != null) total = total.add(section80cHomeLoanPrincipal);
        if (section80cSukanyaSamriddhi != null) total = total.add(section80cSukanyaSamriddhi);
        if (section80cFixedDeposit != null) total = total.add(section80cFixedDeposit);
        if (section80cOthers != null) total = total.add(section80cOthers);
        return total;
    }

    // Helper method to calculate total 80D
    public BigDecimal getTotal80D() {
        BigDecimal total = BigDecimal.ZERO;
        if (section80dSelfFamily != null) total = total.add(section80dSelfFamily);
        if (section80dParents != null) total = total.add(section80dParents);
        if (section80dPreventiveCheckup != null) total = total.add(section80dPreventiveCheckup);
        return total;
    }
}
