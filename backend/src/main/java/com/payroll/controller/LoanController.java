package com.payroll.controller;

import com.payroll.entity.Loan;
import com.payroll.service.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/loans")
@CrossOrigin(origins = "*")
public class LoanController {

    @Autowired
    private LoanService loanService;

    @GetMapping
    public ResponseEntity<List<Loan>> getByOrganization(@RequestHeader("X-Tenant-ID") Long tenantId) {
        return ResponseEntity.ok(loanService.getByOrganization(tenantId));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Loan>> getByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(loanService.getByEmployee(employeeId));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Loan>> getPending(@RequestHeader("X-Tenant-ID") Long tenantId) {
        return ResponseEntity.ok(loanService.getPendingLoans(tenantId));
    }

    @GetMapping("/active")
    public ResponseEntity<List<Loan>> getActive(@RequestHeader("X-Tenant-ID") Long tenantId) {
        return ResponseEntity.ok(loanService.getActiveLoans(tenantId));
    }

    @PostMapping
    public ResponseEntity<Loan> applyLoan(@RequestBody Loan loan, @RequestHeader("X-Tenant-ID") Long tenantId) {
        loan.setOrganizationId(tenantId);
        return ResponseEntity.ok(loanService.applyLoan(loan));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<Loan> approve(@PathVariable Long id, @RequestHeader("X-User-ID") Long userId) {
        return ResponseEntity.ok(loanService.approveLoan(id, userId));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<Loan> reject(
            @PathVariable Long id, 
            @RequestHeader("X-User-ID") Long userId,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(loanService.rejectLoan(id, userId, body.get("reason")));
    }

    @PostMapping("/{id}/disburse")
    public ResponseEntity<Loan> disburse(@PathVariable Long id) {
        return ResponseEntity.ok(loanService.disburseLoan(id));
    }

    @PostMapping("/{id}/emi-payment")
    public ResponseEntity<Loan> recordEmiPayment(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        BigDecimal amount = new BigDecimal(body.get("amount").toString());
        return ResponseEntity.ok(loanService.recordEmiPayment(id, amount));
    }

    @GetMapping("/employee/{employeeId}/monthly-emi")
    public ResponseEntity<BigDecimal> getMonthlyEmi(@PathVariable Long employeeId) {
        return ResponseEntity.ok(loanService.getEmployeeMonthlyEmiDeduction(employeeId));
    }
}
