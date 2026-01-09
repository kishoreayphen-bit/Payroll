package com.payroll.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "investment_declarations")
public class InvestmentDeclaration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(name = "organization_id", nullable = false)
    private Long organizationId;

    @Column(name = "financial_year", nullable = false)
    private String financialYear;

    // Section 80C - Max 1,50,000
    @Column(name = "sec_80c_ppf")
    private BigDecimal sec80cPpf = BigDecimal.ZERO;

    @Column(name = "sec_80c_elss")
    private BigDecimal sec80cElss = BigDecimal.ZERO;

    @Column(name = "sec_80c_life_insurance")
    private BigDecimal sec80cLifeInsurance = BigDecimal.ZERO;

    @Column(name = "sec_80c_nsc")
    private BigDecimal sec80cNsc = BigDecimal.ZERO;

    @Column(name = "sec_80c_sukanya_samriddhi")
    private BigDecimal sec80cSukanyaSamriddhi = BigDecimal.ZERO;

    @Column(name = "sec_80c_tuition_fees")
    private BigDecimal sec80cTuitionFees = BigDecimal.ZERO;

    @Column(name = "sec_80c_home_loan_principal")
    private BigDecimal sec80cHomeLoanPrincipal = BigDecimal.ZERO;

    @Column(name = "sec_80c_fd_5yr")
    private BigDecimal sec80cFd5yr = BigDecimal.ZERO;

    @Column(name = "sec_80c_others")
    private BigDecimal sec80cOthers = BigDecimal.ZERO;

    // Section 80CCD - NPS
    @Column(name = "sec_80ccd_nps_employee")
    private BigDecimal sec80ccdNpsEmployee = BigDecimal.ZERO;

    @Column(name = "sec_80ccd_nps_employer")
    private BigDecimal sec80ccdNpsEmployer = BigDecimal.ZERO;

    @Column(name = "sec_80ccd_1b_additional")
    private BigDecimal sec80ccd1bAdditional = BigDecimal.ZERO;

    // Section 80D - Medical Insurance - Max 25,000 (50,000 for senior citizens)
    @Column(name = "sec_80d_self_family")
    private BigDecimal sec80dSelfFamily = BigDecimal.ZERO;

    @Column(name = "sec_80d_parents")
    private BigDecimal sec80dParents = BigDecimal.ZERO;

    @Column(name = "sec_80d_preventive_checkup")
    private BigDecimal sec80dPreventiveCheckup = BigDecimal.ZERO;

    // Section 80E - Education Loan Interest
    @Column(name = "sec_80e_education_loan")
    private BigDecimal sec80eEducationLoan = BigDecimal.ZERO;

    // Section 80G - Donations
    @Column(name = "sec_80g_donations")
    private BigDecimal sec80gDonations = BigDecimal.ZERO;

    // Section 80EE/80EEA - Home Loan Interest (First time buyers)
    @Column(name = "sec_80ee_home_loan_interest")
    private BigDecimal sec80eeHomeLoanInterest = BigDecimal.ZERO;

    // Section 24 - Home Loan Interest
    @Column(name = "sec_24_home_loan_interest")
    private BigDecimal sec24HomeLoanInterest = BigDecimal.ZERO;

    // HRA Exemption Details
    @Column(name = "hra_rent_paid_annual")
    private BigDecimal hraRentPaidAnnual = BigDecimal.ZERO;

    @Column(name = "hra_landlord_name")
    private String hraLandlordName;

    @Column(name = "hra_landlord_pan")
    private String hraLandlordPan;

    @Column(name = "hra_rental_address")
    private String hraRentalAddress;

    @Column(name = "hra_is_metro_city")
    private Boolean hraIsMetroCity = false;

    // Other Income
    @Column(name = "other_income_interest")
    private BigDecimal otherIncomeInterest = BigDecimal.ZERO;

    @Column(name = "other_income_rental")
    private BigDecimal otherIncomeRental = BigDecimal.ZERO;

    @Column(name = "other_income_others")
    private BigDecimal otherIncomeOthers = BigDecimal.ZERO;

    // Status
    @Column(name = "status")
    private String status = "DRAFT"; // DRAFT, SUBMITTED, APPROVED, REJECTED

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "approved_by")
    private Long approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "remarks")
    private String remarks;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Transient
    public BigDecimal getTotal80C() {
        return sec80cPpf.add(sec80cElss).add(sec80cLifeInsurance).add(sec80cNsc)
                .add(sec80cSukanyaSamriddhi).add(sec80cTuitionFees)
                .add(sec80cHomeLoanPrincipal).add(sec80cFd5yr).add(sec80cOthers);
    }

    @Transient
    public BigDecimal getTotal80D() {
        return sec80dSelfFamily.add(sec80dParents).add(sec80dPreventiveCheckup);
    }

    @Transient
    public BigDecimal getTotalDeductions() {
        BigDecimal total80C = getTotal80C().min(new BigDecimal("150000"));
        BigDecimal total80CCD = sec80ccdNpsEmployee.add(sec80ccd1bAdditional).min(new BigDecimal("50000"));
        BigDecimal total80D = getTotal80D().min(new BigDecimal("75000"));
        
        return total80C.add(total80CCD).add(total80D).add(sec80eEducationLoan)
                .add(sec80gDonations).add(sec80eeHomeLoanInterest).add(sec24HomeLoanInterest);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }

    public String getFinancialYear() { return financialYear; }
    public void setFinancialYear(String financialYear) { this.financialYear = financialYear; }

    public BigDecimal getSec80cPpf() { return sec80cPpf; }
    public void setSec80cPpf(BigDecimal sec80cPpf) { this.sec80cPpf = sec80cPpf; }

    public BigDecimal getSec80cElss() { return sec80cElss; }
    public void setSec80cElss(BigDecimal sec80cElss) { this.sec80cElss = sec80cElss; }

    public BigDecimal getSec80cLifeInsurance() { return sec80cLifeInsurance; }
    public void setSec80cLifeInsurance(BigDecimal sec80cLifeInsurance) { this.sec80cLifeInsurance = sec80cLifeInsurance; }

    public BigDecimal getSec80cNsc() { return sec80cNsc; }
    public void setSec80cNsc(BigDecimal sec80cNsc) { this.sec80cNsc = sec80cNsc; }

    public BigDecimal getSec80cSukanyaSamriddhi() { return sec80cSukanyaSamriddhi; }
    public void setSec80cSukanyaSamriddhi(BigDecimal sec80cSukanyaSamriddhi) { this.sec80cSukanyaSamriddhi = sec80cSukanyaSamriddhi; }

    public BigDecimal getSec80cTuitionFees() { return sec80cTuitionFees; }
    public void setSec80cTuitionFees(BigDecimal sec80cTuitionFees) { this.sec80cTuitionFees = sec80cTuitionFees; }

    public BigDecimal getSec80cHomeLoanPrincipal() { return sec80cHomeLoanPrincipal; }
    public void setSec80cHomeLoanPrincipal(BigDecimal sec80cHomeLoanPrincipal) { this.sec80cHomeLoanPrincipal = sec80cHomeLoanPrincipal; }

    public BigDecimal getSec80cFd5yr() { return sec80cFd5yr; }
    public void setSec80cFd5yr(BigDecimal sec80cFd5yr) { this.sec80cFd5yr = sec80cFd5yr; }

    public BigDecimal getSec80cOthers() { return sec80cOthers; }
    public void setSec80cOthers(BigDecimal sec80cOthers) { this.sec80cOthers = sec80cOthers; }

    public BigDecimal getSec80ccdNpsEmployee() { return sec80ccdNpsEmployee; }
    public void setSec80ccdNpsEmployee(BigDecimal sec80ccdNpsEmployee) { this.sec80ccdNpsEmployee = sec80ccdNpsEmployee; }

    public BigDecimal getSec80ccdNpsEmployer() { return sec80ccdNpsEmployer; }
    public void setSec80ccdNpsEmployer(BigDecimal sec80ccdNpsEmployer) { this.sec80ccdNpsEmployer = sec80ccdNpsEmployer; }

    public BigDecimal getSec80ccd1bAdditional() { return sec80ccd1bAdditional; }
    public void setSec80ccd1bAdditional(BigDecimal sec80ccd1bAdditional) { this.sec80ccd1bAdditional = sec80ccd1bAdditional; }

    public BigDecimal getSec80dSelfFamily() { return sec80dSelfFamily; }
    public void setSec80dSelfFamily(BigDecimal sec80dSelfFamily) { this.sec80dSelfFamily = sec80dSelfFamily; }

    public BigDecimal getSec80dParents() { return sec80dParents; }
    public void setSec80dParents(BigDecimal sec80dParents) { this.sec80dParents = sec80dParents; }

    public BigDecimal getSec80dPreventiveCheckup() { return sec80dPreventiveCheckup; }
    public void setSec80dPreventiveCheckup(BigDecimal sec80dPreventiveCheckup) { this.sec80dPreventiveCheckup = sec80dPreventiveCheckup; }

    public BigDecimal getSec80eEducationLoan() { return sec80eEducationLoan; }
    public void setSec80eEducationLoan(BigDecimal sec80eEducationLoan) { this.sec80eEducationLoan = sec80eEducationLoan; }

    public BigDecimal getSec80gDonations() { return sec80gDonations; }
    public void setSec80gDonations(BigDecimal sec80gDonations) { this.sec80gDonations = sec80gDonations; }

    public BigDecimal getSec80eeHomeLoanInterest() { return sec80eeHomeLoanInterest; }
    public void setSec80eeHomeLoanInterest(BigDecimal sec80eeHomeLoanInterest) { this.sec80eeHomeLoanInterest = sec80eeHomeLoanInterest; }

    public BigDecimal getSec24HomeLoanInterest() { return sec24HomeLoanInterest; }
    public void setSec24HomeLoanInterest(BigDecimal sec24HomeLoanInterest) { this.sec24HomeLoanInterest = sec24HomeLoanInterest; }

    public BigDecimal getHraRentPaidAnnual() { return hraRentPaidAnnual; }
    public void setHraRentPaidAnnual(BigDecimal hraRentPaidAnnual) { this.hraRentPaidAnnual = hraRentPaidAnnual; }

    public String getHraLandlordName() { return hraLandlordName; }
    public void setHraLandlordName(String hraLandlordName) { this.hraLandlordName = hraLandlordName; }

    public String getHraLandlordPan() { return hraLandlordPan; }
    public void setHraLandlordPan(String hraLandlordPan) { this.hraLandlordPan = hraLandlordPan; }

    public String getHraRentalAddress() { return hraRentalAddress; }
    public void setHraRentalAddress(String hraRentalAddress) { this.hraRentalAddress = hraRentalAddress; }

    public Boolean getHraIsMetroCity() { return hraIsMetroCity; }
    public void setHraIsMetroCity(Boolean hraIsMetroCity) { this.hraIsMetroCity = hraIsMetroCity; }

    public BigDecimal getOtherIncomeInterest() { return otherIncomeInterest; }
    public void setOtherIncomeInterest(BigDecimal otherIncomeInterest) { this.otherIncomeInterest = otherIncomeInterest; }

    public BigDecimal getOtherIncomeRental() { return otherIncomeRental; }
    public void setOtherIncomeRental(BigDecimal otherIncomeRental) { this.otherIncomeRental = otherIncomeRental; }

    public BigDecimal getOtherIncomeOthers() { return otherIncomeOthers; }
    public void setOtherIncomeOthers(BigDecimal otherIncomeOthers) { this.otherIncomeOthers = otherIncomeOthers; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public Long getApprovedBy() { return approvedBy; }
    public void setApprovedBy(Long approvedBy) { this.approvedBy = approvedBy; }

    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
