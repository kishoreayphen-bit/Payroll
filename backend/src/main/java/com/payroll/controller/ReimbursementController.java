package com.payroll.controller;

import com.payroll.entity.Reimbursement;
import com.payroll.service.ReimbursementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/reimbursements")
@CrossOrigin(origins = "*")
public class ReimbursementController {

    @Autowired
    private ReimbursementService service;

    @GetMapping
    public ResponseEntity<List<Reimbursement>> getByOrganization(@RequestHeader("X-Tenant-ID") Long tenantId) {
        return ResponseEntity.ok(service.getByOrganization(tenantId));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Reimbursement>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(service.getByEmployee(employeeId));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Reimbursement>> getPending(@RequestHeader("X-Tenant-ID") Long tenantId) {
        return ResponseEntity.ok(service.getPendingClaims(tenantId));
    }

    @GetMapping("/approved-unpaid")
    public ResponseEntity<List<Reimbursement>> getApprovedUnpaid(@RequestHeader("X-Tenant-ID") Long tenantId) {
        return ResponseEntity.ok(service.getApprovedUnpaid(tenantId));
    }

    @PostMapping
    public ResponseEntity<Reimbursement> submitClaim(
            @RequestBody Reimbursement claim, 
            @RequestHeader("X-Tenant-ID") Long tenantId) {
        claim.setOrganizationId(tenantId);
        return ResponseEntity.ok(service.submitClaim(claim));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<Reimbursement> approve(
            @PathVariable Long id, 
            @RequestHeader("X-User-ID") Long userId,
            @RequestBody Map<String, Object> body) {
        BigDecimal amount = new BigDecimal(body.get("approvedAmount").toString());
        return ResponseEntity.ok(service.approveClaim(id, userId, amount));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<Reimbursement> reject(
            @PathVariable Long id, 
            @RequestHeader("X-User-ID") Long userId,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(service.rejectClaim(id, userId, body.get("reason")));
    }

    @PostMapping("/mark-paid")
    public ResponseEntity<String> markAsPaid(@RequestBody Map<String, Object> body) {
        @SuppressWarnings("unchecked")
        List<Long> claimIds = (List<Long>) body.get("claimIds");
        Long payrollId = Long.valueOf(body.get("payrollId").toString());
        service.markAsPaid(claimIds, payrollId);
        return ResponseEntity.ok("Claims marked as paid");
    }

    @GetMapping("/employee/{employeeId}/pending-amount")
    public ResponseEntity<BigDecimal> getPendingAmount(@PathVariable Long employeeId) {
        return ResponseEntity.ok(service.getEmployeePendingReimbursements(employeeId));
    }
}
