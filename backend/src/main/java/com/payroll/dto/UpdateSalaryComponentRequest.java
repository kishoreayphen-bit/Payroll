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
public class UpdateSalaryComponentRequest {

    @NotBlank(message = "Component name is required")
    private String name;

    private String nameInPayslip;

    @NotNull(message = "Component type is required")
    private ComponentType type;

    @NotNull(message = "Calculation type is required")
    private CalculationType calculationType;

    private Long baseComponentId; // For PERCENTAGE calculation type

    private String formula; // For FORMULA calculation type

    private Boolean isTaxable;

    private Boolean isStatutory;

    private Boolean isRecurring;

    private Boolean isVariable;

    private Boolean isPfApplicable;

    private Boolean isIncludeInCtc;

    private Boolean isProRataApplicable;

    private Boolean isActive;

    private Integer displayOrder;

    private String description;
}
