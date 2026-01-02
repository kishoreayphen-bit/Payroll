package com.payroll.dto;

import com.payroll.enums.CalculationType;
import com.payroll.enums.ComponentType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalaryComponentDTO {
    private Long id;
    private Long organizationId;
    private String name;
    private String code;
    private ComponentType type;
    private CalculationType calculationType;
    private Long baseComponentId;
    private String baseComponentName;
    private String formula;
    private Boolean isTaxable;
    private Boolean isStatutory;
    private Boolean isActive;
    private Integer displayOrder;
    private String description;
}
