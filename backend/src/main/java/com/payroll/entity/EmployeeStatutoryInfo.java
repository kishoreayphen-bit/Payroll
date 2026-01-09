package com.payroll.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "employee_statutory_info")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeStatutoryInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false, unique = true)
    private Employee employee;

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    // PF Details
    @Column(name = "uan_number", length = 20)
    private String uanNumber;

    @Column(name = "pf_number", length = 30)
    private String pfNumber;

    @Column(name = "pf_join_date")
    private LocalDate pfJoinDate;

    @Column(name = "is_pf_applicable")
    private Boolean isPfApplicable = true;

    @Column(name = "pf_contribution_opted_out")
    private Boolean pfContributionOptedOut = false;

    // ESI Details
    @Column(name = "esi_number", length = 20)
    private String esiNumber;

    @Column(name = "esi_dispensary", length = 100)
    private String esiDispensary;

    @Column(name = "is_esi_applicable")
    private Boolean isEsiApplicable = true;

    // Professional Tax
    @Column(name = "is_pt_applicable")
    private Boolean isPtApplicable = true;

    @Column(name = "pt_location", length = 50)
    private String ptLocation;

    // TDS/Income Tax
    @Column(name = "tax_regime", length = 10)
    private String taxRegime = "NEW"; // OLD or NEW

    @Column(name = "is_tds_applicable")
    private Boolean isTdsApplicable = true;

    // LWF
    @Column(name = "is_lwf_applicable")
    private Boolean isLwfApplicable = false;

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
