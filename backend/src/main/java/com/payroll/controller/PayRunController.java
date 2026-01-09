package com.payroll.controller;

import com.payroll.dto.PayRunDTO;
import com.payroll.dto.PayRunEmployeeDTO;
import com.payroll.service.PayRunService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/pay-runs")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class PayRunController {

    private final PayRunService payRunService;

    @PostMapping
    public ResponseEntity<PayRunDTO> createPayRun(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @RequestHeader("X-User-ID") Long userId,
            @RequestBody PayRunDTO.CreatePayRunRequest request) {
        log.info("Creating pay run for tenant: {}", tenantId);
        PayRunDTO payRun = payRunService.createPayRun(tenantId, request, userId);
        return ResponseEntity.ok(payRun);
    }

    @GetMapping
    public ResponseEntity<List<PayRunDTO>> getPayRuns(
            @RequestHeader("X-Tenant-ID") Long tenantId) {
        log.info("Getting pay runs for tenant: {}", tenantId);
        List<PayRunDTO> payRuns = payRunService.getPayRuns(tenantId);
        return ResponseEntity.ok(payRuns);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PayRunDTO> getPayRun(
            @PathVariable Long id,
            @RequestHeader("X-Tenant-ID") Long tenantId) {
        log.info("Getting pay run: {} for tenant: {}", id, tenantId);
        PayRunDTO payRun = payRunService.getPayRun(id, tenantId);
        return ResponseEntity.ok(payRun);
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<PayRunDTO> getPayRunWithEmployees(
            @PathVariable Long id,
            @RequestHeader("X-Tenant-ID") Long tenantId) {
        log.info("Getting pay run details: {} for tenant: {}", id, tenantId);
        PayRunDTO payRun = payRunService.getPayRunWithEmployees(id, tenantId);
        return ResponseEntity.ok(payRun);
    }

    @PostMapping("/{id}/calculate")
    public ResponseEntity<PayRunDTO> calculatePayRun(
            @PathVariable Long id,
            @RequestHeader("X-Tenant-ID") Long tenantId) {
        log.info("Calculating pay run: {} for tenant: {}", id, tenantId);
        PayRunDTO payRun = payRunService.calculatePayRun(id, tenantId);
        return ResponseEntity.ok(payRun);
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<PayRunDTO> approvePayRun(
            @PathVariable Long id,
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @RequestHeader("X-User-ID") Long userId) {
        log.info("Approving pay run: {} for tenant: {} by user: {}", id, tenantId, userId);
        PayRunDTO payRun = payRunService.approvePayRun(id, tenantId, userId);
        return ResponseEntity.ok(payRun);
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<PayRunDTO> completePayRun(
            @PathVariable Long id,
            @RequestHeader("X-Tenant-ID") Long tenantId) {
        log.info("Completing pay run: {} for tenant: {}", id, tenantId);
        PayRunDTO payRun = payRunService.completePayRun(id, tenantId);
        return ResponseEntity.ok(payRun);
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Map<String, String>> cancelPayRun(
            @PathVariable Long id,
            @RequestHeader("X-Tenant-ID") Long tenantId) {
        log.info("Cancelling pay run: {} for tenant: {}", id, tenantId);
        payRunService.cancelPayRun(id, tenantId);
        return ResponseEntity.ok(Map.of("message", "Pay run cancelled successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deletePayRun(
            @PathVariable Long id,
            @RequestHeader("X-Tenant-ID") Long tenantId) {
        log.info("Deleting pay run: {} for tenant: {}", id, tenantId);
        payRunService.deletePayRun(id, tenantId);
        return ResponseEntity.ok(Map.of("message", "Pay run deleted successfully"));
    }

    @PutMapping("/{payRunId}/employees/{employeeId}")
    public ResponseEntity<PayRunEmployeeDTO> updatePayRunEmployee(
            @PathVariable Long payRunId,
            @PathVariable Long employeeId,
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @RequestBody PayRunEmployeeDTO.UpdateRequest request) {
        log.info("Updating employee {} in pay run: {}", employeeId, payRunId);
        PayRunEmployeeDTO employee = payRunService.updatePayRunEmployee(payRunId, employeeId, request, tenantId);
        return ResponseEntity.ok(employee);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleException(RuntimeException e) {
        log.error("Error in pay run controller: {}", e.getMessage());
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
}
