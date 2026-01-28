package com.payroll.controller;

import com.payroll.dto.SkipEmployeeRequest;
import com.payroll.dto.OneTimeComponentRequest;
import com.payroll.dto.AddLOPRequest;
import com.payroll.dto.PayRunEmployeeDetailDTO;
import com.payroll.service.PayRunManagementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/pay-runs")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class PayRunManagementController {

    private final PayRunManagementService managementService;

    /**
     * Skip employee from pay run
     */
    @PostMapping("/{payRunId}/employees/{employeeId}/skip")
    public ResponseEntity<?> skipEmployee(
            @PathVariable Long payRunId,
            @PathVariable Long employeeId,
            @RequestBody SkipEmployeeRequest request,
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @RequestHeader(value = "X-User-ID", required = false) Long userId) {
        try {
            managementService.skipEmployee(payRunId, employeeId, request, tenantId, userId);
            return ResponseEntity.ok(Map.of("message", "Employee skipped successfully"));
        } catch (Exception e) {
            log.error("Error skipping employee", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Unskip employee (revert skip)
     */
    @DeleteMapping("/{payRunId}/employees/{employeeId}/skip")
    public ResponseEntity<?> unskipEmployee(
            @PathVariable Long payRunId,
            @PathVariable Long employeeId,
            @RequestHeader("X-Tenant-ID") Long tenantId) {
        try {
            managementService.unskipEmployee(payRunId, employeeId, tenantId);
            return ResponseEntity.ok(Map.of("message", "Employee unskipped successfully"));
        } catch (Exception e) {
            log.error("Error unskipping employee", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Add one-time component (earning or deduction)
     */
    @PostMapping("/{payRunId}/employees/{employeeId}/components")
    public ResponseEntity<?> addOneTimeComponent(
            @PathVariable Long payRunId,
            @PathVariable Long employeeId,
            @RequestBody OneTimeComponentRequest request,
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @RequestHeader(value = "X-User-ID", required = false) Long userId) {
        try {
            managementService.addOneTimeComponent(payRunId, employeeId, request, tenantId, userId);
            return ResponseEntity.ok(Map.of("message", "Component added successfully"));
        } catch (Exception e) {
            log.error("Error adding component", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Delete one-time component
     */
    @DeleteMapping("/components/{componentId}")
    public ResponseEntity<?> deleteComponent(
            @PathVariable Long componentId,
            @RequestHeader("X-Tenant-ID") Long tenantId) {
        try {
            managementService.deleteOneTimeComponent(componentId, tenantId);
            return ResponseEntity.ok(Map.of("message", "Component deleted successfully"));
        } catch (Exception e) {
            log.error("Error deleting component", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Add LOP (Loss of Pay) days
     */
    @PostMapping("/{payRunId}/employees/{employeeId}/lop")
    public ResponseEntity<?> addLOP(
            @PathVariable Long payRunId,
            @PathVariable Long employeeId,
            @RequestBody AddLOPRequest request,
            @RequestHeader("X-Tenant-ID") Long tenantId) {
        try {
            managementService.addLOP(payRunId, employeeId, request, tenantId);
            return ResponseEntity.ok(Map.of("message", "LOP added successfully"));
        } catch (Exception e) {
            log.error("Error adding LOP", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{payRunId}/employees/{employeeId}/withhold")
    public ResponseEntity<?> withholdSalary(
            @PathVariable Long payRunId,
            @PathVariable Long employeeId,
            @RequestHeader("X-Tenant-ID") Long tenantId) {
        try {
            managementService.withholdSalary(payRunId, employeeId, tenantId);
            return ResponseEntity.ok(Map.of("message", "Salary withheld successfully"));
        } catch (Exception e) {
            log.error("Error withholding salary", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{payRunId}/employees/{employeeId}/release")
    public ResponseEntity<?> releaseSalary(
            @PathVariable Long payRunId,
            @PathVariable Long employeeId,
            @RequestHeader("X-Tenant-ID") Long tenantId) {
        try {
            managementService.releaseSalary(payRunId, employeeId, tenantId);
            return ResponseEntity.ok(Map.of("message", "Salary released successfully"));
        } catch (Exception e) {
            log.error("Error releasing salary", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get employee detailed information in pay run
     */
    @GetMapping("/{payRunId}/employees/{employeeId}/details")
    public ResponseEntity<?> getEmployeeDetail(
            @PathVariable Long payRunId,
            @PathVariable Long employeeId,
            @RequestHeader("X-Tenant-ID") Long tenantId) {
        try {
            PayRunEmployeeDetailDTO detail = managementService.getEmployeeDetail(payRunId, employeeId, tenantId);
            return ResponseEntity.ok(detail);
        } catch (Exception e) {
            log.error("Error getting employee detail", e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
