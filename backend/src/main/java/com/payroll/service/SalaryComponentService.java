package com.payroll.service;

import com.payroll.dto.SalaryComponentDTO;
import com.payroll.entity.SalaryComponent;
import com.payroll.enums.ComponentType;
import com.payroll.organization.Organization;
import com.payroll.organization.OrganizationRepository;
import com.payroll.repository.SalaryComponentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalaryComponentService {

    private final SalaryComponentRepository salaryComponentRepository;
    private final OrganizationRepository organizationRepository;

    @Transactional(readOnly = true)
    public List<SalaryComponentDTO> getAllComponents(Long organizationId) {
        return salaryComponentRepository.findByOrganizationIdAndIsActiveTrueOrderByDisplayOrderAsc(organizationId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SalaryComponentDTO> getComponentsByType(Long organizationId, ComponentType type) {
        return salaryComponentRepository.findByOrganizationIdAndTypeAndIsActiveTrue(organizationId, type)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SalaryComponentDTO getComponentById(Long id) {
        SalaryComponent component = salaryComponentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Salary component not found with id: " + id));
        return convertToDTO(component);
    }

    @Transactional
    public SalaryComponentDTO createComponent(SalaryComponentDTO dto) {
        // Check if code already exists
        if (salaryComponentRepository.existsByOrganizationIdAndCode(dto.getOrganizationId(), dto.getCode())) {
            throw new RuntimeException("Component with code " + dto.getCode() + " already exists");
        }

        Organization organization = organizationRepository.findById(dto.getOrganizationId())
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        SalaryComponent component = new SalaryComponent();
        component.setOrganization(organization);
        component.setName(dto.getName());
        component.setCode(dto.getCode());
        component.setType(dto.getType());
        component.setCalculationType(dto.getCalculationType());
        component.setFormula(dto.getFormula());
        component.setIsTaxable(dto.getIsTaxable() != null ? dto.getIsTaxable() : true);
        component.setIsStatutory(dto.getIsStatutory() != null ? dto.getIsStatutory() : false);
        component.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        component.setDisplayOrder(dto.getDisplayOrder() != null ? dto.getDisplayOrder() : 0);
        component.setDescription(dto.getDescription());

        // Set base component if provided
        if (dto.getBaseComponentId() != null) {
            SalaryComponent baseComponent = salaryComponentRepository.findById(dto.getBaseComponentId())
                    .orElseThrow(() -> new RuntimeException("Base component not found"));
            component.setBaseComponent(baseComponent);
        }

        SalaryComponent saved = salaryComponentRepository.save(component);
        return convertToDTO(saved);
    }

    @Transactional
    public SalaryComponentDTO updateComponent(Long id, SalaryComponentDTO dto) {
        SalaryComponent component = salaryComponentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Salary component not found with id: " + id));

        // Check if code is being changed and if new code already exists
        if (!component.getCode().equals(dto.getCode()) &&
                salaryComponentRepository.existsByOrganizationIdAndCode(component.getOrganization().getId(),
                        dto.getCode())) {
            throw new RuntimeException("Component with code " + dto.getCode() + " already exists");
        }

        component.setName(dto.getName());
        component.setCode(dto.getCode());
        component.setType(dto.getType());
        component.setCalculationType(dto.getCalculationType());
        component.setFormula(dto.getFormula());
        component.setIsTaxable(dto.getIsTaxable());
        component.setIsStatutory(dto.getIsStatutory());
        component.setIsActive(dto.getIsActive());
        component.setDisplayOrder(dto.getDisplayOrder());
        component.setDescription(dto.getDescription());

        // Update base component if provided
        if (dto.getBaseComponentId() != null) {
            SalaryComponent baseComponent = salaryComponentRepository.findById(dto.getBaseComponentId())
                    .orElseThrow(() -> new RuntimeException("Base component not found"));
            component.setBaseComponent(baseComponent);
        } else {
            component.setBaseComponent(null);
        }

        SalaryComponent updated = salaryComponentRepository.save(component);
        return convertToDTO(updated);
    }

    @Transactional
    public void deleteComponent(Long id) {
        SalaryComponent component = salaryComponentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Salary component not found with id: " + id));

        // Soft delete
        component.setIsActive(false);
        salaryComponentRepository.save(component);
    }

    private SalaryComponentDTO convertToDTO(SalaryComponent component) {
        SalaryComponentDTO dto = new SalaryComponentDTO();
        dto.setId(component.getId());
        dto.setOrganizationId(component.getOrganization().getId());
        dto.setName(component.getName());
        dto.setCode(component.getCode());
        dto.setType(component.getType());
        dto.setCalculationType(component.getCalculationType());
        dto.setFormula(component.getFormula());
        dto.setIsTaxable(component.getIsTaxable());
        dto.setIsStatutory(component.getIsStatutory());
        dto.setIsActive(component.getIsActive());
        dto.setDisplayOrder(component.getDisplayOrder());
        dto.setDescription(component.getDescription());

        if (component.getBaseComponent() != null) {
            dto.setBaseComponentId(component.getBaseComponent().getId());
            dto.setBaseComponentName(component.getBaseComponent().getName());
        }

        return dto;
    }
}
