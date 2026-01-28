package com.payroll.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SkipEmployeeRequest {

    private String skipType; // "SKIP" or "PAY_AS_ARREARS"

    private String reason;
}
