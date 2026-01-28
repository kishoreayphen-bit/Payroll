package com.payroll.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class PFConfigurationDTO {
    private Long id;
    private Long organizationId;
    private BigDecimal employerContributionRate;
    private BigDecimal employeeContributionRate;
    private BigDecimal pfWageCap;
    private Boolean restrictPfWage;
    private Boolean includeAllowancesIfPfWageLow;
    private Boolean prorateRestrictedPfWage;
    private Boolean considerApplicableAllowances;
}
