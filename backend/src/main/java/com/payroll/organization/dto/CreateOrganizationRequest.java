package com.payroll.organization.dto;

public record CreateOrganizationRequest(
        String companyName,
        String businessLocation,
        String industry,
        String addressLine1,
        String addressLine2,
        String state,
        String city,
        String pinCode,
        String hasRunPayroll) {
}
