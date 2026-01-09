package com.payroll.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "leave_balances")
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(name = "organization_id", nullable = false)
    private Long organizationId;

    @Column(name = "leave_type_id", nullable = false)
    private Long leaveTypeId;

    @Column(name = "year", nullable = false)
    private Integer year;

    @Column(name = "opening_balance")
    private Double openingBalance = 0.0;

    @Column(name = "accrued")
    private Double accrued = 0.0;

    @Column(name = "used")
    private Double used = 0.0;

    @Column(name = "adjustment")
    private Double adjustment = 0.0;

    @Column(name = "carry_forward")
    private Double carryForward = 0.0;

    @Column(name = "encashed")
    private Double encashed = 0.0;

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
    public Double getAvailableBalance() {
        return (openingBalance != null ? openingBalance : 0) +
               (accrued != null ? accrued : 0) +
               (adjustment != null ? adjustment : 0) +
               (carryForward != null ? carryForward : 0) -
               (used != null ? used : 0) -
               (encashed != null ? encashed : 0);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }

    public Long getLeaveTypeId() { return leaveTypeId; }
    public void setLeaveTypeId(Long leaveTypeId) { this.leaveTypeId = leaveTypeId; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public Double getOpeningBalance() { return openingBalance; }
    public void setOpeningBalance(Double openingBalance) { this.openingBalance = openingBalance; }

    public Double getAccrued() { return accrued; }
    public void setAccrued(Double accrued) { this.accrued = accrued; }

    public Double getUsed() { return used; }
    public void setUsed(Double used) { this.used = used; }

    public Double getAdjustment() { return adjustment; }
    public void setAdjustment(Double adjustment) { this.adjustment = adjustment; }

    public Double getCarryForward() { return carryForward; }
    public void setCarryForward(Double carryForward) { this.carryForward = carryForward; }

    public Double getEncashed() { return encashed; }
    public void setEncashed(Double encashed) { this.encashed = encashed; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
