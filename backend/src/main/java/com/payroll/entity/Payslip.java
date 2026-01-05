package com.payroll.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payslips")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payslip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "payslip_number", unique = true)
    private String payslipNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pay_run_employee_id", nullable = false)
    private PayRunEmployee payRunEmployee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    @Column(name = "pay_period_start", nullable = false)
    private LocalDate payPeriodStart;

    @Column(name = "pay_period_end", nullable = false)
    private LocalDate payPeriodEnd;

    @Column(name = "pay_date")
    private LocalDate payDate;

    // Earnings breakdown (JSON or separate columns)
    @Column(name = "basic_salary", precision = 15, scale = 2)
    private BigDecimal basicSalary;

    @Column(name = "hra", precision = 15, scale = 2)
    private BigDecimal hra;

    @Column(name = "conveyance_allowance", precision = 15, scale = 2)
    private BigDecimal conveyanceAllowance;

    @Column(name = "fixed_allowance", precision = 15, scale = 2)
    private BigDecimal fixedAllowance;

    @Column(name = "other_earnings", precision = 15, scale = 2)
    private BigDecimal otherEarnings;

    @Column(name = "gross_salary", precision = 15, scale = 2)
    private BigDecimal grossSalary;

    // Deductions
    @Column(name = "pf_employee", precision = 15, scale = 2)
    private BigDecimal pfEmployee;

    @Column(name = "esi_employee", precision = 15, scale = 2)
    private BigDecimal esiEmployee;

    @Column(name = "professional_tax", precision = 15, scale = 2)
    private BigDecimal professionalTax;

    @Column(name = "tds", precision = 15, scale = 2)
    private BigDecimal tds;

    @Column(name = "lop_deduction", precision = 15, scale = 2)
    private BigDecimal lopDeduction;

    @Column(name = "other_deductions", precision = 15, scale = 2)
    private BigDecimal otherDeductions;

    @Column(name = "total_deductions", precision = 15, scale = 2)
    private BigDecimal totalDeductions;

    // Net pay
    @Column(name = "net_salary", precision = 15, scale = 2)
    private BigDecimal netSalary;

    // Attendance
    @Column(name = "working_days")
    private Integer workingDays;

    @Column(name = "days_worked")
    private Integer daysWorked;

    @Column(name = "lop_days")
    private Integer lopDays;

    // PDF storage
    @Column(name = "pdf_path")
    private String pdfPath;

    @Column(name = "pdf_generated_at")
    private LocalDateTime pdfGeneratedAt;

    // Email status
    @Column(name = "email_sent")
    private Boolean emailSent = false;

    @Column(name = "email_sent_at")
    private LocalDateTime emailSentAt;

    // Status
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PayslipStatus status = PayslipStatus.GENERATED;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (payslipNumber == null) {
            payslipNumber = "PS-" + System.currentTimeMillis();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum PayslipStatus {
        GENERATED,
        SENT,
        VIEWED,
        DOWNLOADED
    }
}
