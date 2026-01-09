package com.payroll.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "professional_tax_slabs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfessionalTaxSlab {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "state", nullable = false, length = 50)
    private String state;

    @Column(name = "from_amount", precision = 15, scale = 2, nullable = false)
    private BigDecimal fromAmount;

    @Column(name = "to_amount", precision = 15, scale = 2)
    private BigDecimal toAmount;

    @Column(name = "tax_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal taxAmount;

    @Column(name = "gender", length = 10)
    private String gender; // M, F, or null for all

    @Column(name = "is_half_yearly")
    private Boolean isHalfYearly = false;

    @Column(name = "applicable_month")
    private Integer applicableMonth; // For states with different rates in Feb/Aug

    @Column(name = "financial_year", length = 10)
    private String financialYear = "2025-26";

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
