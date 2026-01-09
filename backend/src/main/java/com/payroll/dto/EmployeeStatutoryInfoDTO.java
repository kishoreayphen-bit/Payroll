package com.payroll.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeStatutoryInfoDTO {

    private Long id;
    private Long employeeId;
    private String employeeName;
    private String employeeCode;
    private Long tenantId;

    // PF Details
    private String uanNumber;
    private String pfNumber;
    private LocalDate pfJoinDate;
    private Boolean isPfApplicable;
    private Boolean pfContributionOptedOut;

    // ESI Details
    private String esiNumber;
    private String esiDispensary;
    private Boolean isEsiApplicable;

    // PT Details
    private Boolean isPtApplicable;
    private String ptLocation;

    // TDS Details
    private String taxRegime;
    private Boolean isTdsApplicable;

    // LWF Details
    private Boolean isLwfApplicable;
}
