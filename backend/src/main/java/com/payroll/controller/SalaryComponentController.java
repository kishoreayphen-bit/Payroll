package com.payroll.controller;

import com.payroll.dto.SalaryComponentDTO;
import com.payroll.enums.ComponentType;
import com.payroll.service.SalaryComponentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/salary-components")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SalaryComponentController {

    private final SalaryComponentService salaryComponentService;

    @GetMapping
    public ResponseEntity<List<SalaryComponentDTO>> getAllComponents(
            @RequestParam Long organizationId) {
        List<SalaryComponentDTO> components = salaryComponentService.getAllComponents(organizationId);
        return ResponseEntity.ok(components);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalaryComponentDTO> getComponentById(@PathVariable Long id) {
        SalaryComponentDTO component = salaryComponentService.getComponentById(id);
        return ResponseEntity.ok(component);
    }

    @GetMapping("/by-type")
    public ResponseEntity<List<SalaryComponentDTO>> getComponentsByType(
            @RequestParam Long organizationId,
            @RequestParam ComponentType type) {
        List<SalaryComponentDTO> components = salaryComponentService.getComponentsByType(organizationId, type);
        return ResponseEntity.ok(components);
    }

    @GetMapping("/earnings")
    public ResponseEntity<List<SalaryComponentDTO>> getEarnings(
            @RequestParam Long organizationId) {
        List<SalaryComponentDTO> earnings = salaryComponentService.getComponentsByType(organizationId,
                ComponentType.EARNING);
        return ResponseEntity.ok(earnings);
    }

    @GetMapping("/deductions")
    public ResponseEntity<List<SalaryComponentDTO>> getDeductions(
            @RequestParam Long organizationId) {
        List<SalaryComponentDTO> deductions = salaryComponentService.getComponentsByType(organizationId,
                ComponentType.DEDUCTION);
        return ResponseEntity.ok(deductions);
    }

    @PostMapping
    public ResponseEntity<?> createComponent(
            @RequestBody SalaryComponentDTO componentDTO) {
        try {
            SalaryComponentDTO created = salaryComponentService.createComponent(componentDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Collections.singletonMap("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateComponent(
            @PathVariable Long id,
            @RequestBody SalaryComponentDTO componentDTO) {
        try {
            SalaryComponentDTO updated = salaryComponentService.updateComponent(id, componentDTO);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Collections.singletonMap("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComponent(@PathVariable Long id) {
        try {
            salaryComponentService.deleteComponent(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
