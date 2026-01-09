package com.payroll.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "loans")
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(name = "organization_id", nullable = false)
    private Long organizationId;

    @Column(name = "loan_type", nullable = false)
    private String loanType; // SALARY_ADVANCE, PERSONAL_LOAN, EMERGENCY_LOAN, VEHICLE_LOAN, HOME_LOAN

    @Column(name = "loan_number")
    private String loanNumber;

    @Column(name = "principal_amount", nullable = false)
    private BigDecimal principalAmount;

    @Column(name = "interest_rate")
    private BigDecimal interestRate = BigDecimal.ZERO;

    @Column(name = "tenure_months", nullable = false)
    private Integer tenureMonths;

    @Column(name = "emi_amount")
    private BigDecimal emiAmount;

    @Column(name = "total_interest")
    private BigDecimal totalInterest = BigDecimal.ZERO;

    @Column(name = "total_amount")
    private BigDecimal totalAmount;

    @Column(name = "disbursed_amount")
    private BigDecimal disbursedAmount = BigDecimal.ZERO;

    @Column(name = "outstanding_amount")
    private BigDecimal outstandingAmount;

    @Column(name = "paid_amount")
    private BigDecimal paidAmount = BigDecimal.ZERO;

    @Column(name = "paid_emis")
    private Integer paidEmis = 0;

    @Column(name = "pending_emis")
    private Integer pendingEmis;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "next_emi_date")
    private LocalDate nextEmiDate;

    @Column(name = "disbursement_date")
    private LocalDate disbursementDate;

    @Column(name = "purpose")
    private String purpose;

    @Column(name = "status")
    private String status = "PENDING"; // PENDING, APPROVED, DISBURSED, ACTIVE, CLOSED, REJECTED

    @Column(name = "requested_by")
    private Long requestedBy;

    @Column(name = "requested_at")
    private LocalDateTime requestedAt;

    @Column(name = "approved_by")
    private Long approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "rejection_reason")
    private String rejectionReason;

    @Column(name = "deduct_from_salary")
    private Boolean deductFromSalary = true;

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
        requestedAt = LocalDateTime.now();
        if (loanNumber == null) {
            loanNumber = "LN" + System.currentTimeMillis();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void calculateEmi() {
        if (principalAmount == null || tenureMonths == null || tenureMonths == 0) return;
        
        if (interestRate == null || interestRate.compareTo(BigDecimal.ZERO) == 0) {
            // Simple division for zero interest
            emiAmount = principalAmount.divide(new BigDecimal(tenureMonths), 2, java.math.RoundingMode.HALF_UP);
            totalInterest = BigDecimal.ZERO;
            totalAmount = principalAmount;
        } else {
            // EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
            BigDecimal monthlyRate = interestRate.divide(new BigDecimal("1200"), 10, java.math.RoundingMode.HALF_UP);
            BigDecimal onePlusR = BigDecimal.ONE.add(monthlyRate);
            BigDecimal power = onePlusR.pow(tenureMonths);
            
            BigDecimal numerator = principalAmount.multiply(monthlyRate).multiply(power);
            BigDecimal denominator = power.subtract(BigDecimal.ONE);
            
            emiAmount = numerator.divide(denominator, 2, java.math.RoundingMode.HALF_UP);
            totalAmount = emiAmount.multiply(new BigDecimal(tenureMonths));
            totalInterest = totalAmount.subtract(principalAmount);
        }
        
        outstandingAmount = totalAmount;
        pendingEmis = tenureMonths;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }

    public String getLoanType() { return loanType; }
    public void setLoanType(String loanType) { this.loanType = loanType; }

    public String getLoanNumber() { return loanNumber; }
    public void setLoanNumber(String loanNumber) { this.loanNumber = loanNumber; }

    public BigDecimal getPrincipalAmount() { return principalAmount; }
    public void setPrincipalAmount(BigDecimal principalAmount) { this.principalAmount = principalAmount; }

    public BigDecimal getInterestRate() { return interestRate; }
    public void setInterestRate(BigDecimal interestRate) { this.interestRate = interestRate; }

    public Integer getTenureMonths() { return tenureMonths; }
    public void setTenureMonths(Integer tenureMonths) { this.tenureMonths = tenureMonths; }

    public BigDecimal getEmiAmount() { return emiAmount; }
    public void setEmiAmount(BigDecimal emiAmount) { this.emiAmount = emiAmount; }

    public BigDecimal getTotalInterest() { return totalInterest; }
    public void setTotalInterest(BigDecimal totalInterest) { this.totalInterest = totalInterest; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public BigDecimal getDisbursedAmount() { return disbursedAmount; }
    public void setDisbursedAmount(BigDecimal disbursedAmount) { this.disbursedAmount = disbursedAmount; }

    public BigDecimal getOutstandingAmount() { return outstandingAmount; }
    public void setOutstandingAmount(BigDecimal outstandingAmount) { this.outstandingAmount = outstandingAmount; }

    public BigDecimal getPaidAmount() { return paidAmount; }
    public void setPaidAmount(BigDecimal paidAmount) { this.paidAmount = paidAmount; }

    public Integer getPaidEmis() { return paidEmis; }
    public void setPaidEmis(Integer paidEmis) { this.paidEmis = paidEmis; }

    public Integer getPendingEmis() { return pendingEmis; }
    public void setPendingEmis(Integer pendingEmis) { this.pendingEmis = pendingEmis; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public LocalDate getNextEmiDate() { return nextEmiDate; }
    public void setNextEmiDate(LocalDate nextEmiDate) { this.nextEmiDate = nextEmiDate; }

    public LocalDate getDisbursementDate() { return disbursementDate; }
    public void setDisbursementDate(LocalDate disbursementDate) { this.disbursementDate = disbursementDate; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getRequestedBy() { return requestedBy; }
    public void setRequestedBy(Long requestedBy) { this.requestedBy = requestedBy; }

    public LocalDateTime getRequestedAt() { return requestedAt; }
    public void setRequestedAt(LocalDateTime requestedAt) { this.requestedAt = requestedAt; }

    public Long getApprovedBy() { return approvedBy; }
    public void setApprovedBy(Long approvedBy) { this.approvedBy = approvedBy; }

    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public Boolean getDeductFromSalary() { return deductFromSalary; }
    public void setDeductFromSalary(Boolean deductFromSalary) { this.deductFromSalary = deductFromSalary; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
