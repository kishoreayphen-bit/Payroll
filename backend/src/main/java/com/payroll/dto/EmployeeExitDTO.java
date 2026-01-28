package com.payroll.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeExitDTO {
    private Long employeeId;
    private String exitReason;
    private LocalDate lastWorkingDay;
    private String exitNotes;
    private Integer noticePeriodDays;
    private Boolean isNoticePeriodServed;
    private Boolean rehireEligible;
    private Boolean exitInterviewDone;
}
