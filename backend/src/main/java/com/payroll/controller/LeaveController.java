package com.payroll.controller;

import com.payroll.entity.LeaveRequest;
import com.payroll.entity.LeaveType;
import com.payroll.service.LeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Year;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/leave")
@CrossOrigin(origins = "*")
public class LeaveController {

    @Autowired
    private LeaveService leaveService;

    // Leave Types
    @GetMapping("/types")
    public ResponseEntity<List<LeaveType>> getLeaveTypes(@RequestHeader("X-Tenant-ID") Long tenantId) {
        return ResponseEntity.ok(leaveService.getLeaveTypes(tenantId));
    }

    @GetMapping("/types/active")
    public ResponseEntity<List<LeaveType>> getActiveLeaveTypes(@RequestHeader("X-Tenant-ID") Long tenantId) {
        return ResponseEntity.ok(leaveService.getActiveLeaveTypes(tenantId));
    }

    @PostMapping("/types")
    public ResponseEntity<LeaveType> createLeaveType(
            @RequestBody LeaveType leaveType,
            @RequestHeader("X-Tenant-ID") Long tenantId) {
        leaveType.setOrganizationId(tenantId);
        return ResponseEntity.ok(leaveService.createLeaveType(leaveType));
    }

    @PutMapping("/types/{id}")
    public ResponseEntity<LeaveType> updateLeaveType(
            @PathVariable Long id,
            @RequestBody LeaveType leaveType) {
        return ResponseEntity.ok(leaveService.updateLeaveType(id, leaveType));
    }

    @PostMapping("/types/initialize")
    public ResponseEntity<String> initializeDefaultLeaveTypes(@RequestHeader("X-Tenant-ID") Long tenantId) {
        leaveService.initializeDefaultLeaveTypes(tenantId);
        return ResponseEntity.ok("Default leave types initialized");
    }

    // Leave Requests
    @GetMapping("/requests")
    public ResponseEntity<List<LeaveRequest>> getLeaveRequests(@RequestHeader("X-Tenant-ID") Long tenantId) {
        return ResponseEntity.ok(leaveService.getLeaveRequests(tenantId));
    }

    @GetMapping("/requests/employee/{employeeId}")
    public ResponseEntity<List<LeaveRequest>> getEmployeeLeaveRequests(@PathVariable Long employeeId) {
        return ResponseEntity.ok(leaveService.getEmployeeLeaveRequests(employeeId));
    }

    @GetMapping("/requests/pending")
    public ResponseEntity<List<LeaveRequest>> getPendingLeaveRequests(@RequestHeader("X-Tenant-ID") Long tenantId) {
        return ResponseEntity.ok(leaveService.getPendingLeaveRequests(tenantId));
    }

    @PostMapping("/requests")
    public ResponseEntity<LeaveRequest> applyLeave(
            @RequestBody LeaveRequest request,
            @RequestHeader("X-Tenant-ID") Long tenantId) {
        request.setOrganizationId(tenantId);
        return ResponseEntity.ok(leaveService.applyLeave(request));
    }

    @PostMapping("/requests/{id}/approve")
    public ResponseEntity<LeaveRequest> approveLeave(
            @PathVariable Long id,
            @RequestHeader("X-User-ID") Long userId) {
        return ResponseEntity.ok(leaveService.approveLeave(id, userId));
    }

    @PostMapping("/requests/{id}/reject")
    public ResponseEntity<LeaveRequest> rejectLeave(
            @PathVariable Long id,
            @RequestHeader("X-User-ID") Long userId,
            @RequestBody Map<String, String> body) {
        String reason = body.get("reason");
        return ResponseEntity.ok(leaveService.rejectLeave(id, userId, reason));
    }

    @PostMapping("/requests/{id}/cancel")
    public ResponseEntity<LeaveRequest> cancelLeave(@PathVariable Long id) {
        return ResponseEntity.ok(leaveService.cancelLeave(id));
    }

    // Leave Balances
    @GetMapping("/balances/employee/{employeeId}")
    public ResponseEntity<List<Map<String, Object>>> getEmployeeBalances(
            @PathVariable Long employeeId,
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @RequestParam(required = false) Integer year) {
        int targetYear = year != null ? year : Year.now().getValue();
        return ResponseEntity.ok(leaveService.getEmployeeBalancesWithDetails(employeeId, tenantId, targetYear));
    }

    @PostMapping("/balances/adjust")
    public ResponseEntity<String> adjustBalance(
            @RequestParam Long employeeId,
            @RequestParam Long leaveTypeId,
            @RequestParam int year,
            @RequestParam double adjustment,
            @RequestParam(required = false) String reason) {
        leaveService.adjustBalance(employeeId, leaveTypeId, year, adjustment, reason);
        return ResponseEntity.ok("Balance adjusted successfully");
    }
}
