package com.payroll.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "pay_run_employee_skips")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PayRunEmployeeSkip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pay_run_id", nullable = false)
    private Long payRunId;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Enumerated(EnumType.STRING)
    @Column(name = "skip_type", nullable = false)
    private SkipType skipType;

    @Column(name = "reason", columnDefinition = "TEXT", nullable = false)
    private String reason;

    @Column(name = "skipped_by")
    private Long skippedBy;

    @Column(name = "skipped_at")
    private LocalDateTime skippedAt;

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @Column(name = "carried_over_amount", precision = 19, scale = 2)
    private java.math.BigDecimal carriedOverAmount;

    @Column(name = "processed_in_pay_run_id")
    private Long processedInPayRunId;

    // createdAt field intentionally removed to resolve deletion bug.

    @PrePersist
    protected void onCreate() {
        skippedAt = LocalDateTime.now();
    }

    public enum SkipType {
        SKIP, // Skip entirely from this pay run
        PAY_AS_ARREARS // Pay in next pay run
    }
}
