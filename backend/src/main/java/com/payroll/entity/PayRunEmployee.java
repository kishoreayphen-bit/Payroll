package com.payroll.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pay_run_employees")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PayRunEmployee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pay_run_id", nullable = false)
    private PayRun payRun;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    // Basic salary components
    @Column(name = "basic_salary", precision = 15, scale = 2)
    private BigDecimal basicSalary = BigDecimal.ZERO;

    @Column(name = "hra", precision = 15, scale = 2)
    private BigDecimal hra = BigDecimal.ZERO;

    @Column(name = "conveyance_allowance", precision = 15, scale = 2)
    private BigDecimal conveyanceAllowance = BigDecimal.ZERO;

    @Column(name = "fixed_allowance", precision = 15, scale = 2)
    private BigDecimal fixedAllowance = BigDecimal.ZERO;

    @Column(name = "other_earnings", precision = 15, scale = 2)
    private BigDecimal otherEarnings = BigDecimal.ZERO;

    // Gross calculations
    @Column(name = "gross_salary", precision = 15, scale = 2)
    private BigDecimal grossSalary = BigDecimal.ZERO;

    // Attendance/Leave deductions
    @Column(name = "working_days")
    private Integer workingDays = 0;

    @Column(name = "days_worked")
    private Integer daysWorked = 0;

    @Column(name = "leave_days")
    private Integer leaveDays = 0;

    @Column(name = "lop_days", precision = 5, scale = 2)
    private java.math.BigDecimal lopDays = java.math.BigDecimal.ZERO; // Loss of Pay days

    @Column(name = "lop_deduction", precision = 15, scale = 2)
    private BigDecimal lopDeduction = BigDecimal.ZERO;

    // Statutory deductions (Employee contribution)
    @Column(name = "pf_employee", precision = 15, scale = 2)
    private BigDecimal pfEmployee = BigDecimal.ZERO;

    @Column(name = "esi_employee", precision = 15, scale = 2)
    private BigDecimal esiEmployee = BigDecimal.ZERO;

    @Column(name = "professional_tax", precision = 15, scale = 2)
    private BigDecimal professionalTax = BigDecimal.ZERO;

    @Column(name = "tds", precision = 15, scale = 2)
    private BigDecimal tds = BigDecimal.ZERO;

    @Column(name = "other_deductions", precision = 15, scale = 2)
    private BigDecimal otherDeductions = BigDecimal.ZERO;

    // Total deductions
    @Column(name = "total_deductions", precision = 15, scale = 2)
    private BigDecimal totalDeductions = BigDecimal.ZERO;

    // Employer contributions
    @Column(name = "pf_employer", precision = 15, scale = 2)
    private BigDecimal pfEmployer = BigDecimal.ZERO;

    @Column(name = "esi_employer", precision = 15, scale = 2)
    private BigDecimal esiEmployer = BigDecimal.ZERO;

    @Column(name = "total_employer_contribution", precision = 15, scale = 2)
    private BigDecimal totalEmployerContribution = BigDecimal.ZERO;

    // Net pay
    @Column(name = "net_salary", precision = 15, scale = 2)
    private BigDecimal netSalary = BigDecimal.ZERO;

    // Status for individual employee in pay run
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PayRunEmployeeStatus status = PayRunEmployeeStatus.PENDING;

    @Column(name = "payslip_generated")
    private Boolean payslipGenerated = false;

    @Column(name = "payslip_sent")
    private Boolean payslipSent = false;

    @Column(name = "is_skipped")
    private Boolean isSkipped = false;

    @Column(name = "skip_reason", columnDefinition = "TEXT")
    private String skipReason;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

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

    public enum PayRunEmployeeStatus {
        PENDING,
        CALCULATED,
        ON_HOLD,
        EXCLUDED,
        PAID
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PayRun.PaymentStatus paymentStatus = PayRun.PaymentStatus.UNPAID;

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    @Column(name = "is_withheld")
    private Boolean isWithheld = false;

    // Helper method to calculate totals (null-safe)
    public void calculateTotals() {
        // Null-safe getters
        BigDecimal safeBasic = basicSalary != null ? basicSalary : BigDecimal.ZERO;
        BigDecimal safeHra = hra != null ? hra : BigDecimal.ZERO;
        BigDecimal safeConveyance = conveyanceAllowance != null ? conveyanceAllowance : BigDecimal.ZERO;
        BigDecimal safeFixed = fixedAllowance != null ? fixedAllowance : BigDecimal.ZERO;
        BigDecimal safeOtherEarnings = otherEarnings != null ? otherEarnings : BigDecimal.ZERO;
        BigDecimal safeLop = lopDeduction != null ? lopDeduction : BigDecimal.ZERO;
        BigDecimal safePfEmp = pfEmployee != null ? pfEmployee : BigDecimal.ZERO;
        BigDecimal safeEsiEmp = esiEmployee != null ? esiEmployee : BigDecimal.ZERO;
        BigDecimal safePt = professionalTax != null ? professionalTax : BigDecimal.ZERO;
        BigDecimal safeTds = tds != null ? tds : BigDecimal.ZERO;
        BigDecimal safeOtherDed = otherDeductions != null ? otherDeductions : BigDecimal.ZERO;
        BigDecimal safePfEmpr = pfEmployer != null ? pfEmployer : BigDecimal.ZERO;
        BigDecimal safeEsiEmpr = esiEmployer != null ? esiEmployer : BigDecimal.ZERO;

        // Calculate gross salary
        this.grossSalary = safeBasic
                .add(safeHra)
                .add(safeConveyance)
                .add(safeFixed)
                .add(safeOtherEarnings);

        // Calculate total deductions
        this.totalDeductions = safeLop
                .add(safePfEmp)
                .add(safeEsiEmp)
                .add(safePt)
                .add(safeTds)
                .add(safeOtherDed);

        // Calculate total employer contribution
        this.totalEmployerContribution = safePfEmpr.add(safeEsiEmpr);

        // Calculate net salary
        this.netSalary = grossSalary.subtract(totalDeductions);
    }
}
