package com.payroll.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "organization_settings")
public class OrganizationSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "organization_id", nullable = false, unique = true)
    private Long organizationId;

    // Weekend Configuration
    // Options: ALL_SATURDAYS_OFF, ALTERNATE_SATURDAYS (2nd & 4th), SECOND_FOURTH_SATURDAY, FIRST_THIRD_SATURDAY, NO_SATURDAY_OFF
    @Column(name = "saturday_rule")
    private String saturdayRule = "ALL_SATURDAYS_OFF";

    // Sunday is always off by default
    @Column(name = "sunday_off")
    private Boolean sundayOff = true;

    // Holiday Work Compensation
    @Column(name = "holiday_work_enabled")
    private Boolean holidayWorkEnabled = false;

    // Compensation type: EXTRA_PAY, COMP_OFF, DOUBLE_PAY
    @Column(name = "holiday_compensation_type")
    private String holidayCompensationType = "EXTRA_PAY";

    // Multiplier for holiday work (e.g., 1.5 = 150% pay, 2.0 = double pay)
    @Column(name = "holiday_pay_multiplier")
    private Double holidayPayMultiplier = 1.5;

    // Whether to auto-mark government holidays
    @Column(name = "auto_mark_govt_holidays")
    private Boolean autoMarkGovtHolidays = true;

    // State for state-specific holidays (e.g., TN, KA, MH)
    @Column(name = "state_code")
    private String stateCode = "TN";

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

    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }

    public String getSaturdayRule() { return saturdayRule; }
    public void setSaturdayRule(String saturdayRule) { this.saturdayRule = saturdayRule; }

    public Boolean getSundayOff() { return sundayOff; }
    public void setSundayOff(Boolean sundayOff) { this.sundayOff = sundayOff; }

    public Boolean getHolidayWorkEnabled() { return holidayWorkEnabled; }
    public void setHolidayWorkEnabled(Boolean holidayWorkEnabled) { this.holidayWorkEnabled = holidayWorkEnabled; }

    public String getHolidayCompensationType() { return holidayCompensationType; }
    public void setHolidayCompensationType(String holidayCompensationType) { this.holidayCompensationType = holidayCompensationType; }

    public Double getHolidayPayMultiplier() { return holidayPayMultiplier; }
    public void setHolidayPayMultiplier(Double holidayPayMultiplier) { this.holidayPayMultiplier = holidayPayMultiplier; }

    public Boolean getAutoMarkGovtHolidays() { return autoMarkGovtHolidays; }
    public void setAutoMarkGovtHolidays(Boolean autoMarkGovtHolidays) { this.autoMarkGovtHolidays = autoMarkGovtHolidays; }

    public String getStateCode() { return stateCode; }
    public void setStateCode(String stateCode) { this.stateCode = stateCode; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
