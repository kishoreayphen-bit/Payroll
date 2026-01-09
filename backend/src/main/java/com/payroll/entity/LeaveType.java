package com.payroll.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "leave_types")
public class LeaveType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "organization_id", nullable = false)
    private Long organizationId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "code")
    private String code;

    @Column(name = "description")
    private String description;

    @Column(name = "days_per_year")
    private Integer daysPerYear;

    @Column(name = "is_paid")
    private Boolean isPaid = true;

    @Column(name = "is_carry_forward")
    private Boolean isCarryForward = false;

    @Column(name = "max_carry_forward_days")
    private Integer maxCarryForwardDays;

    @Column(name = "is_encashable")
    private Boolean isEncashable = false;

    @Column(name = "max_encashment_days")
    private Integer maxEncashmentDays;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "color")
    private String color;

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

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getDaysPerYear() { return daysPerYear; }
    public void setDaysPerYear(Integer daysPerYear) { this.daysPerYear = daysPerYear; }

    public Boolean getIsPaid() { return isPaid; }
    public void setIsPaid(Boolean isPaid) { this.isPaid = isPaid; }

    public Boolean getIsCarryForward() { return isCarryForward; }
    public void setIsCarryForward(Boolean isCarryForward) { this.isCarryForward = isCarryForward; }

    public Integer getMaxCarryForwardDays() { return maxCarryForwardDays; }
    public void setMaxCarryForwardDays(Integer maxCarryForwardDays) { this.maxCarryForwardDays = maxCarryForwardDays; }

    public Boolean getIsEncashable() { return isEncashable; }
    public void setIsEncashable(Boolean isEncashable) { this.isEncashable = isEncashable; }

    public Integer getMaxEncashmentDays() { return maxEncashmentDays; }
    public void setMaxEncashmentDays(Integer maxEncashmentDays) { this.maxEncashmentDays = maxEncashmentDays; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
