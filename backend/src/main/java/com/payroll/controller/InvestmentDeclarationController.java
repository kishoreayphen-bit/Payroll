package com.payroll.controller;

import com.payroll.entity.InvestmentDeclaration;
import com.payroll.service.InvestmentDeclarationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/investments")
@CrossOrigin(origins = "*")
public class InvestmentDeclarationController {

    @Autowired
    private InvestmentDeclarationService service;

    @GetMapping
    public ResponseEntity<List<InvestmentDeclaration>> getByOrganization(
            @RequestHeader("X-Tenant-ID") Long tenantId) {
        return ResponseEntity.ok(service.getByOrganization(tenantId));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<InvestmentDeclaration>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(service.getByEmployee(employeeId));
    }

    @GetMapping("/employee/{employeeId}/year/{year}")
    public ResponseEntity<InvestmentDeclaration> getByEmployeeAndYear(
            @PathVariable Long employeeId, @PathVariable String year) {
        return service.getByEmployeeAndYear(employeeId, year)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/year/{year}")
    public ResponseEntity<List<InvestmentDeclaration>> getByOrganizationAndYear(
            @RequestHeader("X-Tenant-ID") Long tenantId, @PathVariable String year) {
        return ResponseEntity.ok(service.getByOrganizationAndYear(tenantId, year));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<InvestmentDeclaration>> getPending(
            @RequestHeader("X-Tenant-ID") Long tenantId) {
        return ResponseEntity.ok(service.getPendingDeclarations(tenantId));
    }

    @PostMapping
    public ResponseEntity<InvestmentDeclaration> createOrUpdate(
            @RequestBody InvestmentDeclaration declaration,
            @RequestHeader("X-Tenant-ID") Long tenantId) {
        declaration.setOrganizationId(tenantId);
        return ResponseEntity.ok(service.createOrUpdate(declaration));
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<InvestmentDeclaration> submit(@PathVariable Long id) {
        return ResponseEntity.ok(service.submit(id));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<InvestmentDeclaration> approve(
            @PathVariable Long id, @RequestHeader("X-User-ID") Long userId) {
        return ResponseEntity.ok(service.approve(id, userId));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<InvestmentDeclaration> reject(
            @PathVariable Long id, 
            @RequestHeader("X-User-ID") Long userId,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(service.reject(id, userId, body.get("reason")));
    }

    @GetMapping("/deductions/{employeeId}/{year}")
    public ResponseEntity<BigDecimal> getTotalDeductions(
            @PathVariable Long employeeId, @PathVariable String year) {
        return ResponseEntity.ok(service.calculateTotalDeductions(employeeId, year));
    }
}
