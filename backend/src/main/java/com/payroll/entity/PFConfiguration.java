package com.payroll.entity;

import com.payroll.organization.Organization;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pf_configurations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PFConfiguration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false, unique = true)
    private Organization organization;

    @Column(name = "employer_contribution_rate", precision = 5, scale = 2)
    private BigDecimal employerContributionRate = new BigDecimal("12.00");

    @Column(name = "employee_contribution_rate", precision = 5, scale = 2)
    private BigDecimal employeeContributionRate = new BigDecimal("12.00");

    @Column(name = "pf_wage_cap", precision = 10, scale = 2)
    private BigDecimal pfWageCap = new BigDecimal("15000.00");

    @Column(name = "restrict_pf_wage")
    private Boolean restrictPfWage = true;

    @Column(name = "include_allowances_if_pf_wage_low")
    private Boolean includeAllowancesIfPfWageLow = true;

    @Column(name = "prorate_restricted_pf_wage")
    private Boolean prorateRestrictedPfWage = false;

    @Column(name = "consider_applicable_allowances")
    private Boolean considerApplicableAllowances = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
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
        if (this.updatedAt == null) {
            this.updatedAt = LocalDateTime.now();
        }
    }
}
