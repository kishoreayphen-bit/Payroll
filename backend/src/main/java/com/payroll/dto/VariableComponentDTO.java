package com.payroll.dto;

import com.payroll.enums.ComponentType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Lightweight DTO for variable component dropdowns in pay run
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VariableComponentDTO {
    private Long id;
    private String name;
    private String code;
    private ComponentType type;
    private Boolean isTaxable;
}
