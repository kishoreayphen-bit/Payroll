package com.payroll.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance")
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(name = "organization_id", nullable = false)
    private Long organizationId;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "check_in_time")
    private LocalTime checkInTime;

    @Column(name = "check_out_time")
    private LocalTime checkOutTime;

    @Column(name = "status")
    private String status; // PRESENT, ABSENT, HALF_DAY, LEAVE, HOLIDAY, WEEKEND

    @Column(name = "leave_type_id")
    private Long leaveTypeId; // Reference to leave type when status is LEAVE

    @Column(name = "leave_request_id")
    private Long leaveRequestId; // Reference to leave request when status is LEAVE

    @Column(name = "holiday_id")
    private Long holidayId; // Reference to holiday when status is HOLIDAY

    @Column(name = "is_holiday_work")
    private Boolean isHolidayWork = false; // True if employee worked on a holiday

    @Column(name = "holiday_compensation_applied")
    private Boolean holidayCompensationApplied = false; // True if compensation was applied

    @Column(name = "work_hours")
    private Double workHours;

    @Column(name = "overtime_hours")
    private Double overtimeHours;

    @Column(name = "late_minutes")
    private Integer lateMinutes;

    @Column(name = "early_leaving_minutes")
    private Integer earlyLeavingMinutes;

    @Column(name = "remarks")
    private String remarks;

    @Column(name = "is_regularized")
    private Boolean isRegularized = false;

    @Column(name = "regularization_reason")
    private String regularizationReason;

    @Column(name = "approved_by")
    private Long approvedBy;

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

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public LocalTime getCheckInTime() { return checkInTime; }
    public void setCheckInTime(LocalTime checkInTime) { this.checkInTime = checkInTime; }

    public LocalTime getCheckOutTime() { return checkOutTime; }
    public void setCheckOutTime(LocalTime checkOutTime) { this.checkOutTime = checkOutTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getLeaveTypeId() { return leaveTypeId; }
    public void setLeaveTypeId(Long leaveTypeId) { this.leaveTypeId = leaveTypeId; }

    public Long getLeaveRequestId() { return leaveRequestId; }
    public void setLeaveRequestId(Long leaveRequestId) { this.leaveRequestId = leaveRequestId; }

    public Long getHolidayId() { return holidayId; }
    public void setHolidayId(Long holidayId) { this.holidayId = holidayId; }

    public Boolean getIsHolidayWork() { return isHolidayWork; }
    public void setIsHolidayWork(Boolean isHolidayWork) { this.isHolidayWork = isHolidayWork; }

    public Boolean getHolidayCompensationApplied() { return holidayCompensationApplied; }
    public void setHolidayCompensationApplied(Boolean holidayCompensationApplied) { this.holidayCompensationApplied = holidayCompensationApplied; }

    public Double getWorkHours() { return workHours; }
    public void setWorkHours(Double workHours) { this.workHours = workHours; }

    public Double getOvertimeHours() { return overtimeHours; }
    public void setOvertimeHours(Double overtimeHours) { this.overtimeHours = overtimeHours; }

    public Integer getLateMinutes() { return lateMinutes; }
    public void setLateMinutes(Integer lateMinutes) { this.lateMinutes = lateMinutes; }

    public Integer getEarlyLeavingMinutes() { return earlyLeavingMinutes; }
    public void setEarlyLeavingMinutes(Integer earlyLeavingMinutes) { this.earlyLeavingMinutes = earlyLeavingMinutes; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public Boolean getIsRegularized() { return isRegularized; }
    public void setIsRegularized(Boolean isRegularized) { this.isRegularized = isRegularized; }

    public String getRegularizationReason() { return regularizationReason; }
    public void setRegularizationReason(String regularizationReason) { this.regularizationReason = regularizationReason; }

    public Long getApprovedBy() { return approvedBy; }
    public void setApprovedBy(Long approvedBy) { this.approvedBy = approvedBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
