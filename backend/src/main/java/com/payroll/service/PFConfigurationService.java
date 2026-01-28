package com.payroll.service;

import com.payroll.dto.PFConfigurationDTO;
import com.payroll.entity.PFConfiguration;
import com.payroll.organization.OrganizationRepository;
import com.payroll.repository.PFConfigurationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PFConfigurationService {

    private final PFConfigurationRepository pfConfigurationRepository;
    private final OrganizationRepository organizationRepository;

    @Transactional(readOnly = true)
    public PFConfigurationDTO getConfiguration(Long organizationId) {
        PFConfiguration config = pfConfigurationRepository.findByOrganizationId(organizationId)
                .orElse(createDefaultConfiguration(organizationId));
        return convertToDTO(config);
    }

    @Transactional
    public PFConfigurationDTO saveConfiguration(Long organizationId, PFConfigurationDTO dto) {
        PFConfiguration config = pfConfigurationRepository.findByOrganizationId(organizationId)
                .orElse(new PFConfiguration());

        if (config.getOrganization() == null) {
            config.setOrganization(organizationRepository.findById(organizationId)
                    .orElseThrow(() -> new RuntimeException("Organization not found")));
        }

        config.setEmployerContributionRate(dto.getEmployerContributionRate());
        config.setEmployeeContributionRate(dto.getEmployeeContributionRate());
        config.setPfWageCap(dto.getPfWageCap());
        config.setRestrictPfWage(dto.getRestrictPfWage());
        config.setIncludeAllowancesIfPfWageLow(dto.getIncludeAllowancesIfPfWageLow());
        config.setProrateRestrictedPfWage(dto.getProrateRestrictedPfWage());
        config.setConsiderApplicableAllowances(dto.getConsiderApplicableAllowances());

        PFConfiguration saved = pfConfigurationRepository.save(config);
        return convertToDTO(saved);
    }

    private PFConfiguration createDefaultConfiguration(Long organizationId) {
        PFConfiguration config = new PFConfiguration();
        config.setOrganization(organizationRepository.findById(organizationId)
                .orElseThrow(() -> new RuntimeException("Organization not found")));
        // Defaults are set in Entity
        return pfConfigurationRepository.save(config);
    }

    private PFConfigurationDTO convertToDTO(PFConfiguration entity) {
        PFConfigurationDTO dto = new PFConfigurationDTO();
        dto.setId(entity.getId());
        dto.setOrganizationId(entity.getOrganization().getId());
        dto.setEmployerContributionRate(entity.getEmployerContributionRate());
        dto.setEmployeeContributionRate(entity.getEmployeeContributionRate());
        dto.setPfWageCap(entity.getPfWageCap());
        dto.setRestrictPfWage(entity.getRestrictPfWage());
        dto.setIncludeAllowancesIfPfWageLow(entity.getIncludeAllowancesIfPfWageLow());
        dto.setProrateRestrictedPfWage(entity.getProrateRestrictedPfWage());
        dto.setConsiderApplicableAllowances(entity.getConsiderApplicableAllowances());
        return dto;
    }
}
