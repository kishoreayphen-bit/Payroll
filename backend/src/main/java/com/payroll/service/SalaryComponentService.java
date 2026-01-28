package com.payroll.service;

import com.payroll.dto.SalaryComponentDTO;
import com.payroll.dto.VariableComponentDTO;
import com.payroll.entity.SalaryComponent;
import com.payroll.enums.CalculationType;
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
                return salaryComponentRepository
                                .findByOrganizationIdAndIsActiveTrueOrderByDisplayOrderAsc(organizationId)
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

        /**
         * Get variable components for dropdown (filtered by type)
         */
        @Transactional(readOnly = true)
        public List<VariableComponentDTO> getVariableComponents(Long organizationId, ComponentType type) {
                return salaryComponentRepository
                                .findByOrganizationIdAndIsActiveTrueAndIsVariableTrueAndTypeOrderByNameAsc(
                                                organizationId, type)
                                .stream()
                                .map(this::convertToVariableDTO)
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
                component.setIsRecurring(dto.getIsRecurring() != null ? dto.getIsRecurring() : true);
                component.setIsVariable(dto.getIsVariable() != null ? dto.getIsVariable() : false);
                component.setIsPfApplicable(dto.getIsPfApplicable() != null ? dto.getIsPfApplicable() : false);
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
                                salaryComponentRepository.existsByOrganizationIdAndCode(
                                                component.getOrganization().getId(),
                                                dto.getCode())) {
                        throw new RuntimeException("Component with code " + dto.getCode() + " already exists");
                }

                component.setName(dto.getName());
                component.setNameInPayslip(dto.getNameInPayslip());
                component.setCode(dto.getCode());
                component.setType(dto.getType());
                component.setCalculationType(dto.getCalculationType());
                component.setFormula(dto.getFormula());
                component.setIsTaxable(dto.getIsTaxable());
                component.setIsStatutory(dto.getIsStatutory());
                component.setIsRecurring(dto.getIsRecurring());
                component.setIsVariable(dto.getIsVariable());
                component.setIsPfApplicable(dto.getIsPfApplicable());
                component.setIsIncludeInCtc(dto.getIsIncludeInCtc());
                component.setIsProRataApplicable(dto.getIsProRataApplicable());
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
                dto.setNameInPayslip(component.getNameInPayslip());
                dto.setCode(component.getCode());
                dto.setType(component.getType());
                dto.setCalculationType(component.getCalculationType());
                dto.setFormula(component.getFormula());
                dto.setIsTaxable(component.getIsTaxable());
                dto.setIsStatutory(component.getIsStatutory());
                dto.setIsRecurring(component.getIsRecurring());
                dto.setIsVariable(component.getIsVariable());
                dto.setIsPfApplicable(component.getIsPfApplicable());
                dto.setIsIncludeInCtc(component.getIsIncludeInCtc());
                dto.setIsProRataApplicable(component.getIsProRataApplicable());
                dto.setIsActive(component.getIsActive());
                dto.setDisplayOrder(component.getDisplayOrder());
                dto.setDescription(component.getDescription());
                dto.setCreatedAt(component.getCreatedAt());
                dto.setUpdatedAt(component.getUpdatedAt());

                if (component.getBaseComponent() != null) {
                        dto.setBaseComponentId(component.getBaseComponent().getId());
                        dto.setBaseComponentName(component.getBaseComponent().getName());
                }

                return dto;
        }

        private VariableComponentDTO convertToVariableDTO(SalaryComponent component) {
                return new VariableComponentDTO(
                                component.getId(),
                                component.getName(),
                                component.getCode(),
                                component.getType(),
                                component.getIsTaxable());
        }

        @Transactional
        public void createDefaults(Long organizationId) {
                Organization organization = organizationRepository.findById(organizationId)
                                .orElseThrow(() -> new RuntimeException("Organization not found"));

                // 1. Basic Salary
                createSystemComponent(organization, "Basic Salary", "BASIC", ComponentType.EARNING,
                                CalculationType.PERCENTAGE, true, false, true, false, false, true, true, 1,
                                "Basic salary component, typically 50% of CTC");

                // 2. HRA
                createSystemComponent(organization, "House Rent Allowance", "HRA", ComponentType.EARNING,
                                CalculationType.PERCENTAGE, true, false, true, false, false, true, true, 2,
                                "Housing allowance, typically 50% of basic salary");

                // 3. Conveyance
                createSystemComponent(organization, "Conveyance Allowance", "CONVEYANCE", ComponentType.EARNING,
                                CalculationType.FIXED, false, false, true, false, false, true, false, 3,
                                "Transport/travel allowance");

                // 4. Special Allowance
                createSystemComponent(organization, "Special Allowance", "SPECIAL", ComponentType.EARNING,
                                CalculationType.FIXED, true, false, true, false, false, true, true, 4,
                                "Special allowance");

                // 5. Medical
                createSystemComponent(organization, "Medical Allowance", "MEDICAL", ComponentType.EARNING,
                                CalculationType.FIXED, false, false, true, false, false, true, false, 5,
                                "Medical reimbursement allowance");

                // 6. Bonus (Variable)
                createSystemComponent(organization, "Performance Bonus", "BONUS", ComponentType.EARNING,
                                CalculationType.FIXED, true, false, false, true, false, false, false, 6,
                                "Performance-based bonus");

                // 7. Commission (Variable)
                createSystemComponent(organization, "Commission", "COMMISSION", ComponentType.EARNING,
                                CalculationType.FIXED, true, false, false, true, false, false, false, 9,
                                "Sales commission");

                // 8. Leave Encashment (Variable)
                createSystemComponent(organization, "Leave Encashment", "LEAVE_ENCASHMENT", ComponentType.EARNING,
                                CalculationType.FIXED, true, false, false, true, false, false, false, 10,
                                "Encashment of unused leave");

                // 9. PF (Statutory)
                createSystemComponent(organization, "Provident Fund (Employee)", "PF_EMPLOYEE", ComponentType.DEDUCTION,
                                CalculationType.PERCENTAGE, false, true, true, false, false, false, false, 1,
                                "Employee PF contribution");

                // 10. PT (Statutory)
                createSystemComponent(organization, "Professional Tax", "PT", ComponentType.DEDUCTION,
                                CalculationType.FIXED, false, true, true, false, false, false, false, 2,
                                "Professional Tax");

                // 11. Salary Advance (Variable Deduction)
                createSystemComponent(organization, "Salary Advance", "SALARY_ADVANCE", ComponentType.DEDUCTION,
                                CalculationType.FIXED, false, false, false, true, false, false, false, 11,
                                "Recovery of salary advance");

                // 12. Damage Recovery (Variable Deduction)
                createSystemComponent(organization, "Damage Recovery", "DAMAGE_RECOVERY", ComponentType.DEDUCTION,
                                CalculationType.FIXED, false, false, false, true, false, false, false, 12,
                                "Recovery for damages");
        }

        private void createSystemComponent(Organization org, String name, String code, ComponentType type,
                        CalculationType calcType, boolean taxable, boolean statutory,
                        boolean recurring, boolean variable, boolean pfApplicable,
                        boolean includeInCtc, boolean proRata, int order, String desc) {
                if (salaryComponentRepository.existsByOrganizationIdAndCode(org.getId(), code))
                        return;

                SalaryComponent sc = new SalaryComponent();
                sc.setOrganization(org);
                sc.setName(name);
                sc.setNameInPayslip(name);
                sc.setCode(code);
                sc.setType(type);
                sc.setCalculationType(calcType);
                sc.setIsTaxable(taxable);
                sc.setIsStatutory(statutory);
                sc.setIsRecurring(recurring);
                sc.setIsVariable(variable);
                sc.setIsPfApplicable(pfApplicable);
                sc.setIsIncludeInCtc(includeInCtc);
                sc.setIsProRataApplicable(proRata);
                sc.setDisplayOrder(order);
                sc.setDescription(desc);
                sc.setIsActive(true);
                salaryComponentRepository.save(sc);
        }
}
