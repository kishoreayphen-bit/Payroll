package com.payroll.dto;

import com.payroll.enums.CalculationType;
import com.payroll.enums.ComponentType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateSalaryComponentRequest {

    @NotNull(message = "Organization ID is required")
    private Long organizationId;

    @NotBlank(message = "Component name is required")
    private String name;

    @NotBlank(message = "Component code is required")
    private String code;

    private String nameInPayslip;

    @NotNull(message = "Component type is required")
    private ComponentType type;

    @NotNull(message = "Calculation type is required")
    private CalculationType calculationType;

    private Long baseComponentId; // For PERCENTAGE calculation type

    private String formula; // For FORMULA calculation type

    private Boolean isTaxable = true;

    private Boolean isStatutory = false;

    private Boolean isRecurring = true;

    private Boolean isVariable = false;

    private Boolean isPfApplicable = false;

    private Boolean isIncludeInCtc = true;

    private Boolean isProRataApplicable = true;

    private Boolean isActive = true;

    private Integer displayOrder = 0;

    private String description;
}
