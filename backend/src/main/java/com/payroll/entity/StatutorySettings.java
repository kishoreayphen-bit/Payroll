package com.payroll.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "statutory_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatutorySettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    // PF Settings
    @Column(name = "pf_enabled")
    private Boolean pfEnabled = true;

    @Column(name = "pf_employee_rate", precision = 5, scale = 2)
    private BigDecimal pfEmployeeRate = new BigDecimal("12.00");

    @Column(name = "pf_employer_rate", precision = 5, scale = 2)
    private BigDecimal pfEmployerRate = new BigDecimal("12.00");

    @Column(name = "pf_admin_charges_rate", precision = 5, scale = 2)
    private BigDecimal pfAdminChargesRate = new BigDecimal("0.50");

    @Column(name = "pf_edli_rate", precision = 5, scale = 2)
    private BigDecimal pfEdliRate = new BigDecimal("0.50");

    @Column(name = "pf_wage_ceiling", precision = 15, scale = 2)
    private BigDecimal pfWageCeiling = new BigDecimal("15000.00");

    @Column(name = "pf_include_employer_contribution_in_ctc")
    private Boolean pfIncludeEmployerContributionInCtc = true;

    @Column(name = "pf_establishment_id", length = 50)
    private String pfEstablishmentId;

    @Column(name = "pf_establishment_name")
    private String pfEstablishmentName;

    // ESI Settings
    @Column(name = "esi_enabled")
    private Boolean esiEnabled = true;

    @Column(name = "esi_employee_rate", precision = 5, scale = 2)
    private BigDecimal esiEmployeeRate = new BigDecimal("0.75");

    @Column(name = "esi_employer_rate", precision = 5, scale = 2)
    private BigDecimal esiEmployerRate = new BigDecimal("3.25");

    @Column(name = "esi_wage_ceiling", precision = 15, scale = 2)
    private BigDecimal esiWageCeiling = new BigDecimal("21000.00");

    @Column(name = "esi_code", length = 50)
    private String esiCode;

    // Professional Tax Settings
    @Column(name = "pt_enabled")
    private Boolean ptEnabled = true;

    @Column(name = "pt_state", length = 50)
    private String ptState = "Tamil Nadu";

    // TDS Settings
    @Column(name = "tds_enabled")
    private Boolean tdsEnabled = true;

    @Column(name = "tan_number", length = 20)
    private String tanNumber;

    @Column(name = "deductor_name")
    private String deductorName;

    @Column(name = "deductor_category", length = 50)
    private String deductorCategory = "Company";

    // LWF Settings (Labour Welfare Fund)
    @Column(name = "lwf_enabled")
    private Boolean lwfEnabled = false;

    @Column(name = "lwf_employee_contribution", precision = 10, scale = 2)
    private BigDecimal lwfEmployeeContribution = BigDecimal.ZERO;

    @Column(name = "lwf_employer_contribution", precision = 10, scale = 2)
    private BigDecimal lwfEmployerContribution = BigDecimal.ZERO;

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
