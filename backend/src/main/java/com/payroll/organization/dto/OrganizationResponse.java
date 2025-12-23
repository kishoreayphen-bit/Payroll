package com.payroll.organization.dto;

import java.time.LocalDateTime;

public record OrganizationResponse(
        Long id,
        String companyName,
        String businessLocation,
        String industry,
        String addressLine1,
        String addressLine2,
        String state,
        String city,
        String pinCode,
        Boolean hasRunPayroll,
        LocalDateTime createdAt) {
}
