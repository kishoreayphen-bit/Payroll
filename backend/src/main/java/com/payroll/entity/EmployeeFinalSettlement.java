package com.payroll.entity;

import com.payroll.organization.Organization;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "employee_final_settlements")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeFinalSettlement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @Column(name = "settlement_date")
    private LocalDate settlementDate;

    @Column(name = "last_working_day", nullable = false)
    private LocalDate lastWorkingDay;

    // Salary components
    @Column(name = "pending_salary", precision = 15, scale = 2)
    private BigDecimal pendingSalary = BigDecimal.ZERO;

    @Column(name = "prorated_salary", precision = 15, scale = 2)
    private BigDecimal proratedSalary = BigDecimal.ZERO;

    @Column(name = "worked_days")
    private Integer workedDays = 0;

    @Column(name = "total_days_in_month")
    private Integer totalDaysInMonth = 0;

    // Leave encashment
    @Column(name = "leave_balance_days", precision = 5, scale = 2)
    private BigDecimal leaveBalanceDays = BigDecimal.ZERO;

    @Column(name = "leave_encashment_amount", precision = 15, scale = 2)
    private BigDecimal leaveEncashmentAmount = BigDecimal.ZERO;

    // Gratuity
    @Column(name = "is_gratuity_eligible")
    private Boolean isGratuityEligible = false;

    @Column(name = "years_of_service", precision = 5, scale = 2)
    private BigDecimal yearsOfService = BigDecimal.ZERO;

    @Column(name = "gratuity_amount", precision = 15, scale = 2)
    private BigDecimal gratuityAmount = BigDecimal.ZERO;

    // Notice period
    @Column(name = "notice_period_days")
    private Integer noticePeriodDays = 0;

    @Column(name = "notice_period_served_days")
    private Integer noticePeriodServedDays = 0;

    @Column(name = "notice_pay_recovery", precision = 15, scale = 2)
    private BigDecimal noticePayRecovery = BigDecimal.ZERO;

    @Column(name = "notice_pay_payable", precision = 15, scale = 2)
    private BigDecimal noticePayPayable = BigDecimal.ZERO;

    // Bonus and other components
    @Column(name = "bonus_payable", precision = 15, scale = 2)
    private BigDecimal bonusPayable = BigDecimal.ZERO;

    @Column(name = "other_earnings", precision = 15, scale = 2)
    private BigDecimal otherEarnings = BigDecimal.ZERO;

    // Deductions
    @Column(name = "pending_loans", precision = 15, scale = 2)
    private BigDecimal pendingLoans = BigDecimal.ZERO;

    @Column(name = "other_deductions", precision = 15, scale = 2)
    private BigDecimal otherDeductions = BigDecimal.ZERO;

    @Column(name = "tds_on_settlement", precision = 15, scale = 2)
    private BigDecimal tdsOnSettlement = BigDecimal.ZERO;

    // Totals
    @Column(name = "total_earnings", precision = 15, scale = 2)
    private BigDecimal totalEarnings = BigDecimal.ZERO;

    @Column(name = "total_deductions", precision = 15, scale = 2)
    private BigDecimal totalDeductions = BigDecimal.ZERO;

    @Column(name = "net_settlement_amount", precision = 15, scale = 2)
    private BigDecimal netSettlementAmount = BigDecimal.ZERO;

    // Status tracking
    @Column(name = "status", length = 50)
    private String status = "DRAFT";

    @Column(name = "approved_by")
    private Long approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "payment_reference", length = 100)
    private String paymentReference;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
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
        this.updatedAt = LocalDateTime.now();
    }

    public void calculateTotals() {
        this.totalEarnings = BigDecimal.ZERO
                .add(proratedSalary != null ? proratedSalary : BigDecimal.ZERO)
                .add(pendingSalary != null ? pendingSalary : BigDecimal.ZERO)
                .add(leaveEncashmentAmount != null ? leaveEncashmentAmount : BigDecimal.ZERO)
                .add(gratuityAmount != null ? gratuityAmount : BigDecimal.ZERO)
                .add(noticePayPayable != null ? noticePayPayable : BigDecimal.ZERO)
                .add(bonusPayable != null ? bonusPayable : BigDecimal.ZERO)
                .add(otherEarnings != null ? otherEarnings : BigDecimal.ZERO);

        this.totalDeductions = BigDecimal.ZERO
                .add(noticePayRecovery != null ? noticePayRecovery : BigDecimal.ZERO)
                .add(pendingLoans != null ? pendingLoans : BigDecimal.ZERO)
                .add(otherDeductions != null ? otherDeductions : BigDecimal.ZERO)
                .add(tdsOnSettlement != null ? tdsOnSettlement : BigDecimal.ZERO);

        this.netSettlementAmount = this.totalEarnings.subtract(this.totalDeductions);
    }
}
