package com.payroll.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pay_runs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PayRun {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pay_run_number", unique = true)
    private String payRunNumber;

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @Column(name = "pay_period_start", nullable = false)
    private LocalDate payPeriodStart;

    @Column(name = "pay_period_end", nullable = false)
    private LocalDate payPeriodEnd;

    @Column(name = "pay_date")
    private LocalDate payDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PayRunStatus status = PayRunStatus.DRAFT;

    @Column(name = "total_gross_pay", precision = 15, scale = 2)
    private BigDecimal totalGrossPay = BigDecimal.ZERO;

    @Column(name = "total_deductions", precision = 15, scale = 2)
    private BigDecimal totalDeductions = BigDecimal.ZERO;

    @Column(name = "total_net_pay", precision = 15, scale = 2)
    private BigDecimal totalNetPay = BigDecimal.ZERO;

    @Column(name = "total_employer_contributions", precision = 15, scale = 2)
    private BigDecimal totalEmployerContributions = BigDecimal.ZERO;

    @Column(name = "employee_count")
    private Integer employeeCount = 0;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "processed_by")
    private Long processedBy;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @Column(name = "approved_by")
    private Long approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "payRun", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PayRunEmployee> payRunEmployees = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (payRunNumber == null) {
            payRunNumber = "PR-" + System.currentTimeMillis();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum PayRunStatus {
        DRAFT,           // Initial state, can be edited
        CALCULATING,     // Payroll calculations in progress
        PENDING_APPROVAL,// Ready for review/approval
        APPROVED,        // Approved, ready for payment
        PROCESSING,      // Payment processing in progress
        COMPLETED,       // Payroll completed
        CANCELLED        // Cancelled
    }
}
