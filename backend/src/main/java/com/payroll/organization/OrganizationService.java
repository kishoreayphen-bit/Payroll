package com.payroll.organization;

import com.payroll.organization.dto.CreateOrganizationRequest;
import com.payroll.organization.dto.OrganizationResponse;
import com.payroll.user.User;
import com.payroll.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;

    public OrganizationService(OrganizationRepository organizationRepository, UserRepository userRepository) {
        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
    }

    public OrganizationResponse createOrganization(CreateOrganizationRequest request) {
        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        // Create organization
        Organization organization = Organization.builder()
                .companyName(request.companyName())
                .businessLocation(request.businessLocation())
                .industry(request.industry())
                .addressLine1(request.addressLine1())
                .addressLine2(request.addressLine2())
                .state(request.state())
                .city(request.city())
                .pinCode(request.pinCode())
                .hasRunPayroll("yes".equalsIgnoreCase(request.hasRunPayroll()))
                .createdBy(user)
                .build();

        organization = organizationRepository.save(organization);

        return mapToResponse(java.util.Objects.requireNonNull(organization));
    }

    public List<OrganizationResponse> getUserOrganizations() {
        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        List<Organization> organizations = organizationRepository.findByCreatedById(user.getId());

        return organizations.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private OrganizationResponse mapToResponse(Organization org) {
        return new OrganizationResponse(
                org.getId(),
                org.getCompanyName(),
                org.getBusinessLocation(),
                org.getIndustry(),
                org.getAddressLine1(),
                org.getAddressLine2(),
                org.getState(),
                org.getCity(),
                org.getPinCode(),
                org.getHasRunPayroll(),
                org.getCreatedAt());
    }
}
