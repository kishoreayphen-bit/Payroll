package com.payroll.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatutorySettingsDTO {

    private Long id;
    private Long tenantId;

    // PF Settings
    private Boolean pfEnabled;
    private BigDecimal pfEmployeeRate;
    private BigDecimal pfEmployerRate;
    private BigDecimal pfAdminChargesRate;
    private BigDecimal pfEdliRate;
    private BigDecimal pfWageCeiling;
    private Boolean pfIncludeEmployerContributionInCtc;
    private String pfEstablishmentId;
    private String pfEstablishmentName;

    // ESI Settings
    private Boolean esiEnabled;
    private BigDecimal esiEmployeeRate;
    private BigDecimal esiEmployerRate;
    private BigDecimal esiWageCeiling;
    private String esiCode;

    // PT Settings
    private Boolean ptEnabled;
    private String ptState;

    // TDS Settings
    private Boolean tdsEnabled;
    private String tanNumber;
    private String deductorName;
    private String deductorCategory;

    // LWF Settings
    private Boolean lwfEnabled;
    private BigDecimal lwfEmployeeContribution;
    private BigDecimal lwfEmployerContribution;
}
