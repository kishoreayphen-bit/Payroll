package com.payroll.controller;

import com.payroll.dto.*;
import com.payroll.entity.ProfessionalTaxSlab;
import com.payroll.service.StatutoryComplianceService;
import com.payroll.service.TDSCalculationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/statutory")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class StatutoryComplianceController {

    private final StatutoryComplianceService statutoryComplianceService;
    private final TDSCalculationService tdsCalculationService;

    // ==================== STATUTORY SETTINGS ====================

    @GetMapping("/settings")
    public ResponseEntity<StatutorySettingsDTO> getStatutorySettings(
            @RequestHeader("X-Tenant-ID") Long tenantId) {
        log.info("Getting statutory settings for tenant: {}", tenantId);
        return ResponseEntity.ok(statutoryComplianceService.getStatutorySettings(tenantId));
    }

    @PostMapping("/settings")
    public ResponseEntity<StatutorySettingsDTO> saveStatutorySettings(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @RequestBody StatutorySettingsDTO dto) {
        log.info("Saving statutory settings for tenant: {}", tenantId);
        return ResponseEntity.ok(statutoryComplianceService.saveStatutorySettings(tenantId, dto));
    }

    // ==================== EMPLOYEE STATUTORY INFO ====================

    @GetMapping("/employees")
    public ResponseEntity<List<EmployeeStatutoryInfoDTO>> getAllEmployeeStatutoryInfo(
            @RequestHeader("X-Tenant-ID") Long tenantId) {
        log.info("Getting all employee statutory info for tenant: {}", tenantId);
        return ResponseEntity.ok(statutoryComplianceService.getAllEmployeeStatutoryInfo(tenantId));
    }

    @GetMapping("/employees/{employeeId}")
    public ResponseEntity<EmployeeStatutoryInfoDTO> getEmployeeStatutoryInfo(
            @PathVariable Long employeeId) {
        log.info("Getting statutory info for employee: {}", employeeId);
        EmployeeStatutoryInfoDTO info = statutoryComplianceService.getEmployeeStatutoryInfo(employeeId);
        if (info == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(info);
    }

    @PostMapping("/employees/{employeeId}")
    public ResponseEntity<EmployeeStatutoryInfoDTO> saveEmployeeStatutoryInfo(
            @PathVariable Long employeeId,
            @RequestBody EmployeeStatutoryInfoDTO dto) {
        log.info("Saving statutory info for employee: {}", employeeId);
        return ResponseEntity.ok(statutoryComplianceService.saveEmployeeStatutoryInfo(employeeId, dto));
    }

    // ==================== PROFESSIONAL TAX ====================

    @GetMapping("/pt/slabs")
    public ResponseEntity<List<ProfessionalTaxSlab>> getAllPTSlabs() {
        log.info("Getting all PT slabs");
        return ResponseEntity.ok(statutoryComplianceService.getAllPTSlabs());
    }

    @GetMapping("/pt/slabs/{state}")
    public ResponseEntity<List<ProfessionalTaxSlab>> getPTSlabsByState(
            @PathVariable String state) {
        log.info("Getting PT slabs for state: {}", state);
        return ResponseEntity.ok(statutoryComplianceService.getPTSlabsByState(state));
    }

    @GetMapping("/pt/states")
    public ResponseEntity<List<String>> getAllPTStates() {
        log.info("Getting all PT states");
        return ResponseEntity.ok(statutoryComplianceService.getAllPTStates());
    }

    @PostMapping("/pt/initialize")
    public ResponseEntity<String> initializePTSlabs(
            @RequestHeader("X-Tenant-ID") Long tenantId) {
        log.info("Initializing PT slabs");
        statutoryComplianceService.initializeDefaultPTSlabs();
        return ResponseEntity.ok("PT slabs initialized successfully");
    }

    // ==================== TAX DECLARATIONS ====================

    @GetMapping("/tax-declarations/employee/{employeeId}")
    public ResponseEntity<TaxDeclarationDTO> getTaxDeclaration(
            @PathVariable Long employeeId,
            @RequestParam(defaultValue = "2025-26") String financialYear) {
        log.info("Getting tax declaration for employee: {} year: {}", employeeId, financialYear);
        return ResponseEntity.ok(tdsCalculationService.getTaxDeclaration(employeeId, financialYear));
    }

    @GetMapping("/tax-declarations")
    public ResponseEntity<List<TaxDeclarationDTO>> getAllTaxDeclarations(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @RequestParam(defaultValue = "2025-26") String financialYear) {
        log.info("Getting all tax declarations for tenant: {} year: {}", tenantId, financialYear);
        return ResponseEntity.ok(tdsCalculationService.getAllTaxDeclarations(tenantId, financialYear));
    }

    @PostMapping("/tax-declarations/employee/{employeeId}")
    public ResponseEntity<TaxDeclarationDTO> saveTaxDeclaration(
            @PathVariable Long employeeId,
            @RequestBody TaxDeclarationDTO dto) {
        log.info("Saving tax declaration for employee: {}", employeeId);
        return ResponseEntity.ok(tdsCalculationService.saveTaxDeclaration(employeeId, dto));
    }

    @PostMapping("/tax-declarations/employee/{employeeId}/submit")
    public ResponseEntity<TaxDeclarationDTO> submitTaxDeclaration(
            @PathVariable Long employeeId,
            @RequestParam(defaultValue = "2025-26") String financialYear) {
        log.info("Submitting tax declaration for employee: {} year: {}", employeeId, financialYear);
        return ResponseEntity.ok(tdsCalculationService.submitTaxDeclaration(employeeId, financialYear));
    }

    // ==================== TAX CALCULATION ====================

    @GetMapping("/tax-calculation/employee/{employeeId}")
    public ResponseEntity<TaxCalculationDTO> calculateTax(
            @PathVariable Long employeeId,
            @RequestParam(defaultValue = "2025-26") String financialYear) {
        log.info("Calculating tax for employee: {} year: {}", employeeId, financialYear);
        return ResponseEntity.ok(tdsCalculationService.calculateTax(employeeId, financialYear));
    }

    @GetMapping("/monthly-tds/employee/{employeeId}")
    public ResponseEntity<java.math.BigDecimal> getMonthlyTDS(
            @PathVariable Long employeeId,
            @RequestParam(defaultValue = "2025-26") String financialYear) {
        log.info("Getting monthly TDS for employee: {} year: {}", employeeId, financialYear);
        return ResponseEntity.ok(tdsCalculationService.calculateMonthlyTDS(employeeId, financialYear));
    }
}
