package com.payroll.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OneTimeComponentRequest {

    private String componentType; // "EARNING" or "DEDUCTION"

    private String componentName;

    private BigDecimal amount;

    private Boolean isTaxable = true;

    private String notes;
}
