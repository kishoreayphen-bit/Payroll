package com.payroll.service;

import com.payroll.dto.EmployeeStatutoryInfoDTO;
import com.payroll.dto.StatutorySettingsDTO;
import com.payroll.entity.*;
import com.payroll.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StatutoryComplianceService {

    private final StatutorySettingsRepository statutorySettingsRepository;
    private final EmployeeStatutoryInfoRepository employeeStatutoryInfoRepository;
    private final ProfessionalTaxSlabRepository professionalTaxSlabRepository;
    private final EmployeeRepository employeeRepository;

    // ==================== STATUTORY SETTINGS ====================

    @Transactional(readOnly = true)
    public StatutorySettingsDTO getStatutorySettings(Long tenantId) {
        StatutorySettings settings = statutorySettingsRepository.findByTenantId(tenantId)
                .orElseGet(() -> createDefaultSettings(tenantId));
        return convertToDTO(settings);
    }

    @Transactional
    public StatutorySettingsDTO saveStatutorySettings(Long tenantId, StatutorySettingsDTO dto) {
        StatutorySettings settings = statutorySettingsRepository.findByTenantId(tenantId)
                .orElse(new StatutorySettings());

        settings.setTenantId(tenantId);

        // PF Settings
        settings.setPfEnabled(dto.getPfEnabled());
        settings.setPfEmployeeRate(dto.getPfEmployeeRate());
        settings.setPfEmployerRate(dto.getPfEmployerRate());
        settings.setPfAdminChargesRate(dto.getPfAdminChargesRate());
        settings.setPfEdliRate(dto.getPfEdliRate());
        settings.setPfWageCeiling(dto.getPfWageCeiling());
        settings.setPfIncludeEmployerContributionInCtc(dto.getPfIncludeEmployerContributionInCtc());
        settings.setPfEstablishmentId(dto.getPfEstablishmentId());
        settings.setPfEstablishmentName(dto.getPfEstablishmentName());

        // ESI Settings
        settings.setEsiEnabled(dto.getEsiEnabled());
        settings.setEsiEmployeeRate(dto.getEsiEmployeeRate());
        settings.setEsiEmployerRate(dto.getEsiEmployerRate());
        settings.setEsiWageCeiling(dto.getEsiWageCeiling());
        settings.setEsiCode(dto.getEsiCode());

        // PT Settings
        settings.setPtEnabled(dto.getPtEnabled());
        settings.setPtState(dto.getPtState());

        // TDS Settings
        settings.setTdsEnabled(dto.getTdsEnabled());
        settings.setTanNumber(dto.getTanNumber());
        settings.setDeductorName(dto.getDeductorName());
        settings.setDeductorCategory(dto.getDeductorCategory());

        // LWF Settings
        settings.setLwfEnabled(dto.getLwfEnabled());
        settings.setLwfEmployeeContribution(dto.getLwfEmployeeContribution());
        settings.setLwfEmployerContribution(dto.getLwfEmployerContribution());

        settings = statutorySettingsRepository.save(settings);
        return convertToDTO(settings);
    }

    private StatutorySettings createDefaultSettings(Long tenantId) {
        StatutorySettings settings = new StatutorySettings();
        settings.setTenantId(tenantId);
        return statutorySettingsRepository.save(settings);
    }

    // ==================== EMPLOYEE STATUTORY INFO ====================

    @Transactional(readOnly = true)
    public List<EmployeeStatutoryInfoDTO> getAllEmployeeStatutoryInfo(Long tenantId) {
        return employeeStatutoryInfoRepository.findByTenantId(tenantId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EmployeeStatutoryInfoDTO getEmployeeStatutoryInfo(Long employeeId) {
        return employeeStatutoryInfoRepository.findByEmployeeId(employeeId)
                .map(this::convertToDTO)
                .orElse(null);
    }

    @Transactional
    public EmployeeStatutoryInfoDTO saveEmployeeStatutoryInfo(Long employeeId, EmployeeStatutoryInfoDTO dto) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        EmployeeStatutoryInfo info = employeeStatutoryInfoRepository.findByEmployeeId(employeeId)
                .orElse(new EmployeeStatutoryInfo());

        info.setEmployee(employee);
        info.setTenantId(employee.getOrganization().getId());

        // PF Details
        info.setUanNumber(dto.getUanNumber());
        info.setPfNumber(dto.getPfNumber());
        info.setPfJoinDate(dto.getPfJoinDate());
        info.setIsPfApplicable(dto.getIsPfApplicable());
        info.setPfContributionOptedOut(dto.getPfContributionOptedOut());

        // ESI Details
        info.setEsiNumber(dto.getEsiNumber());
        info.setEsiDispensary(dto.getEsiDispensary());
        info.setIsEsiApplicable(dto.getIsEsiApplicable());

        // PT Details
        info.setIsPtApplicable(dto.getIsPtApplicable());
        info.setPtLocation(dto.getPtLocation());

        // TDS Details
        info.setTaxRegime(dto.getTaxRegime());
        info.setIsTdsApplicable(dto.getIsTdsApplicable());

        // LWF Details
        info.setIsLwfApplicable(dto.getIsLwfApplicable());

        info = employeeStatutoryInfoRepository.save(info);
        return convertToDTO(info);
    }

    // ==================== PF CALCULATIONS ====================

    public BigDecimal calculatePFEmployee(BigDecimal basicSalary, Long tenantId) {
        StatutorySettings settings = statutorySettingsRepository.findByTenantId(tenantId)
                .orElse(new StatutorySettings());

        if (!settings.getPfEnabled()) {
            return BigDecimal.ZERO;
        }

        BigDecimal pfWage = basicSalary;
        if (settings.getPfWageCeiling() != null && basicSalary.compareTo(settings.getPfWageCeiling()) > 0) {
            pfWage = settings.getPfWageCeiling();
        }

        return pfWage.multiply(settings.getPfEmployeeRate().divide(BigDecimal.valueOf(100)))
                .setScale(0, RoundingMode.HALF_UP);
    }

    public BigDecimal calculatePFEmployer(BigDecimal basicSalary, Long tenantId) {
        StatutorySettings settings = statutorySettingsRepository.findByTenantId(tenantId)
                .orElse(new StatutorySettings());

        if (!settings.getPfEnabled()) {
            return BigDecimal.ZERO;
        }

        BigDecimal pfWage = basicSalary;
        if (settings.getPfWageCeiling() != null && basicSalary.compareTo(settings.getPfWageCeiling()) > 0) {
            pfWage = settings.getPfWageCeiling();
        }

        return pfWage.multiply(settings.getPfEmployerRate().divide(BigDecimal.valueOf(100)))
                .setScale(0, RoundingMode.HALF_UP);
    }

    // ==================== ESI CALCULATIONS ====================

    public BigDecimal calculateESIEmployee(BigDecimal grossSalary, Long tenantId) {
        StatutorySettings settings = statutorySettingsRepository.findByTenantId(tenantId)
                .orElse(new StatutorySettings());

        if (!settings.getEsiEnabled()) {
            return BigDecimal.ZERO;
        }

        if (grossSalary.compareTo(settings.getEsiWageCeiling()) > 0) {
            return BigDecimal.ZERO;
        }

        return grossSalary.multiply(settings.getEsiEmployeeRate().divide(BigDecimal.valueOf(100)))
                .setScale(0, RoundingMode.HALF_UP);
    }

    public BigDecimal calculateESIEmployer(BigDecimal grossSalary, Long tenantId) {
        StatutorySettings settings = statutorySettingsRepository.findByTenantId(tenantId)
                .orElse(new StatutorySettings());

        if (!settings.getEsiEnabled()) {
            return BigDecimal.ZERO;
        }

        if (grossSalary.compareTo(settings.getEsiWageCeiling()) > 0) {
            return BigDecimal.ZERO;
        }

        return grossSalary.multiply(settings.getEsiEmployerRate().divide(BigDecimal.valueOf(100)))
                .setScale(0, RoundingMode.HALF_UP);
    }

    // ==================== PROFESSIONAL TAX ====================

    public BigDecimal calculateProfessionalTax(BigDecimal grossSalary, String state, String gender) {
        if (state == null || state.isEmpty()) {
            state = "Tamil Nadu"; // Default
        }

        List<ProfessionalTaxSlab> slabs = professionalTaxSlabRepository
                .findByStateAndIsActiveOrderByFromAmountAsc(state, true);

        if (slabs.isEmpty()) {
            // Fall back to default Tamil Nadu slabs
            return calculateDefaultPT(grossSalary);
        }

        for (ProfessionalTaxSlab slab : slabs) {
            // Check gender if applicable
            if (slab.getGender() != null && !slab.getGender().isEmpty()) {
                if (gender == null || !slab.getGender().equalsIgnoreCase(gender.substring(0, 1))) {
                    continue;
                }
            }

            boolean inRange = grossSalary.compareTo(slab.getFromAmount()) >= 0;
            if (slab.getToAmount() != null) {
                inRange = inRange && grossSalary.compareTo(slab.getToAmount()) <= 0;
            }

            if (inRange) {
                return slab.getTaxAmount();
            }
        }

        return BigDecimal.ZERO;
    }

    private BigDecimal calculateDefaultPT(BigDecimal grossSalary) {
        // Tamil Nadu PT slabs
        if (grossSalary.compareTo(new BigDecimal("3500")) < 0) {
            return BigDecimal.ZERO;
        } else if (grossSalary.compareTo(new BigDecimal("5000")) <= 0) {
            return new BigDecimal("22.50");
        } else if (grossSalary.compareTo(new BigDecimal("10000")) <= 0) {
            return new BigDecimal("52.50");
        } else {
            return new BigDecimal("208");
        }
    }

    // ==================== PT SLABS MANAGEMENT ====================

    @Transactional(readOnly = true)
    public List<ProfessionalTaxSlab> getAllPTSlabs() {
        return professionalTaxSlabRepository.findByIsActiveOrderByStateAscFromAmountAsc(true);
    }

    @Transactional(readOnly = true)
    public List<ProfessionalTaxSlab> getPTSlabsByState(String state) {
        return professionalTaxSlabRepository.findByStateAndIsActiveOrderByFromAmountAsc(state, true);
    }

    @Transactional(readOnly = true)
    public List<String> getAllPTStates() {
        return professionalTaxSlabRepository.findAllActiveStates();
    }

    @Transactional
    public void initializeDefaultPTSlabs() {
        // Check if slabs already exist
        if (!professionalTaxSlabRepository.findAll().isEmpty()) {
            return;
        }

        // Tamil Nadu
        createPTSlab("Tamil Nadu", BigDecimal.ZERO, new BigDecimal("3500"), BigDecimal.ZERO);
        createPTSlab("Tamil Nadu", new BigDecimal("3501"), new BigDecimal("5000"), new BigDecimal("22.50"));
        createPTSlab("Tamil Nadu", new BigDecimal("5001"), new BigDecimal("10000"), new BigDecimal("52.50"));
        createPTSlab("Tamil Nadu", new BigDecimal("10001"), null, new BigDecimal("208"));

        // Karnataka
        createPTSlab("Karnataka", BigDecimal.ZERO, new BigDecimal("15000"), BigDecimal.ZERO);
        createPTSlab("Karnataka", new BigDecimal("15001"), new BigDecimal("25000"), new BigDecimal("150"));
        createPTSlab("Karnataka", new BigDecimal("25001"), null, new BigDecimal("200"));

        // Maharashtra
        createPTSlab("Maharashtra", BigDecimal.ZERO, new BigDecimal("7500"), BigDecimal.ZERO);
        createPTSlab("Maharashtra", new BigDecimal("7501"), new BigDecimal("10000"), new BigDecimal("175"));
        createPTSlab("Maharashtra", new BigDecimal("10001"), null, new BigDecimal("200")); // 2500 for Feb

        // Andhra Pradesh
        createPTSlab("Andhra Pradesh", BigDecimal.ZERO, new BigDecimal("15000"), BigDecimal.ZERO);
        createPTSlab("Andhra Pradesh", new BigDecimal("15001"), new BigDecimal("20000"), new BigDecimal("150"));
        createPTSlab("Andhra Pradesh", new BigDecimal("20001"), null, new BigDecimal("200"));

        // Telangana
        createPTSlab("Telangana", BigDecimal.ZERO, new BigDecimal("15000"), BigDecimal.ZERO);
        createPTSlab("Telangana", new BigDecimal("15001"), new BigDecimal("20000"), new BigDecimal("150"));
        createPTSlab("Telangana", new BigDecimal("20001"), null, new BigDecimal("200"));

        // West Bengal
        createPTSlab("West Bengal", BigDecimal.ZERO, new BigDecimal("10000"), BigDecimal.ZERO);
        createPTSlab("West Bengal", new BigDecimal("10001"), new BigDecimal("15000"), new BigDecimal("110"));
        createPTSlab("West Bengal", new BigDecimal("15001"), new BigDecimal("25000"), new BigDecimal("130"));
        createPTSlab("West Bengal", new BigDecimal("25001"), new BigDecimal("40000"), new BigDecimal("150"));
        createPTSlab("West Bengal", new BigDecimal("40001"), null, new BigDecimal("200"));

        // Gujarat
        createPTSlab("Gujarat", BigDecimal.ZERO, new BigDecimal("5999"), BigDecimal.ZERO);
        createPTSlab("Gujarat", new BigDecimal("6000"), new BigDecimal("8999"), new BigDecimal("80"));
        createPTSlab("Gujarat", new BigDecimal("9000"), new BigDecimal("11999"), new BigDecimal("150"));
        createPTSlab("Gujarat", new BigDecimal("12000"), null, new BigDecimal("200"));

        // Kerala (No PT)
        createPTSlab("Kerala", BigDecimal.ZERO, null, BigDecimal.ZERO);

        log.info("Initialized default Professional Tax slabs for all states");
    }

    private void createPTSlab(String state, BigDecimal from, BigDecimal to, BigDecimal tax) {
        ProfessionalTaxSlab slab = new ProfessionalTaxSlab();
        slab.setState(state);
        slab.setFromAmount(from);
        slab.setToAmount(to);
        slab.setTaxAmount(tax);
        slab.setIsActive(true);
        slab.setFinancialYear("2025-26");
        professionalTaxSlabRepository.save(slab);
    }

    // ==================== CONVERTERS ====================

    private StatutorySettingsDTO convertToDTO(StatutorySettings entity) {
        StatutorySettingsDTO dto = new StatutorySettingsDTO();
        dto.setId(entity.getId());
        dto.setTenantId(entity.getTenantId());

        // PF
        dto.setPfEnabled(entity.getPfEnabled());
        dto.setPfEmployeeRate(entity.getPfEmployeeRate());
        dto.setPfEmployerRate(entity.getPfEmployerRate());
        dto.setPfAdminChargesRate(entity.getPfAdminChargesRate());
        dto.setPfEdliRate(entity.getPfEdliRate());
        dto.setPfWageCeiling(entity.getPfWageCeiling());
        dto.setPfIncludeEmployerContributionInCtc(entity.getPfIncludeEmployerContributionInCtc());
        dto.setPfEstablishmentId(entity.getPfEstablishmentId());
        dto.setPfEstablishmentName(entity.getPfEstablishmentName());

        // ESI
        dto.setEsiEnabled(entity.getEsiEnabled());
        dto.setEsiEmployeeRate(entity.getEsiEmployeeRate());
        dto.setEsiEmployerRate(entity.getEsiEmployerRate());
        dto.setEsiWageCeiling(entity.getEsiWageCeiling());
        dto.setEsiCode(entity.getEsiCode());

        // PT
        dto.setPtEnabled(entity.getPtEnabled());
        dto.setPtState(entity.getPtState());

        // TDS
        dto.setTdsEnabled(entity.getTdsEnabled());
        dto.setTanNumber(entity.getTanNumber());
        dto.setDeductorName(entity.getDeductorName());
        dto.setDeductorCategory(entity.getDeductorCategory());

        // LWF
        dto.setLwfEnabled(entity.getLwfEnabled());
        dto.setLwfEmployeeContribution(entity.getLwfEmployeeContribution());
        dto.setLwfEmployerContribution(entity.getLwfEmployerContribution());

        return dto;
    }

    private EmployeeStatutoryInfoDTO convertToDTO(EmployeeStatutoryInfo entity) {
        EmployeeStatutoryInfoDTO dto = new EmployeeStatutoryInfoDTO();
        dto.setId(entity.getId());
        dto.setEmployeeId(entity.getEmployee().getId());
        dto.setEmployeeName(entity.getEmployee().getFullName());
        dto.setEmployeeCode(entity.getEmployee().getEmployeeId());
        dto.setTenantId(entity.getTenantId());

        // PF
        dto.setUanNumber(entity.getUanNumber());
        dto.setPfNumber(entity.getPfNumber());
        dto.setPfJoinDate(entity.getPfJoinDate());
        dto.setIsPfApplicable(entity.getIsPfApplicable());
        dto.setPfContributionOptedOut(entity.getPfContributionOptedOut());

        // ESI
        dto.setEsiNumber(entity.getEsiNumber());
        dto.setEsiDispensary(entity.getEsiDispensary());
        dto.setIsEsiApplicable(entity.getIsEsiApplicable());

        // PT
        dto.setIsPtApplicable(entity.getIsPtApplicable());
        dto.setPtLocation(entity.getPtLocation());

        // TDS
        dto.setTaxRegime(entity.getTaxRegime());
        dto.setIsTdsApplicable(entity.getIsTdsApplicable());

        // LWF
        dto.setIsLwfApplicable(entity.getIsLwfApplicable());

        return dto;
    }
}
