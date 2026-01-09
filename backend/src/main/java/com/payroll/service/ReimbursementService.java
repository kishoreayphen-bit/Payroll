package com.payroll.service;

import com.payroll.entity.Reimbursement;
import com.payroll.repository.ReimbursementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReimbursementService {

    @Autowired
    private ReimbursementRepository repository;

    public List<Reimbursement> getByOrganization(Long organizationId) {
        return repository.findByOrganizationId(organizationId);
    }

    public List<Reimbursement> getByEmployee(Long employeeId) {
        return repository.findByEmployeeId(employeeId);
    }

    public List<Reimbursement> getPendingClaims(Long organizationId) {
        return repository.findByOrganizationIdAndStatus(organizationId, "PENDING");
    }

    public List<Reimbursement> getApprovedUnpaid(Long organizationId) {
        return repository.findApprovedUnpaidByOrganization(organizationId);
    }

    public List<Reimbursement> getEmployeeApprovedUnpaid(Long employeeId) {
        return repository.findApprovedUnpaidByEmployee(employeeId);
    }

    @Transactional
    public Reimbursement submitClaim(Reimbursement claim) {
        claim.setStatus("PENDING");
        claim.setSubmittedAt(LocalDateTime.now());
        return repository.save(claim);
    }

    @Transactional
    public Reimbursement approveClaim(Long claimId, Long approvedBy, BigDecimal approvedAmount) {
        Reimbursement claim = repository.findById(claimId)
            .orElseThrow(() -> new RuntimeException("Claim not found"));
        
        claim.setStatus(approvedAmount.compareTo(claim.getAmount()) < 0 ? "PARTIALLY_APPROVED" : "APPROVED");
        claim.setApprovedBy(approvedBy);
        claim.setApprovedAt(LocalDateTime.now());
        claim.setApprovedAmount(approvedAmount);
        return repository.save(claim);
    }

    @Transactional
    public Reimbursement rejectClaim(Long claimId, Long rejectedBy, String reason) {
        Reimbursement claim = repository.findById(claimId)
            .orElseThrow(() -> new RuntimeException("Claim not found"));
        
        claim.setStatus("REJECTED");
        claim.setApprovedBy(rejectedBy);
        claim.setApprovedAt(LocalDateTime.now());
        claim.setRejectionReason(reason);
        return repository.save(claim);
    }

    @Transactional
    public void markAsPaid(List<Long> claimIds, Long payrollId) {
        for (Long claimId : claimIds) {
            Reimbursement claim = repository.findById(claimId).orElse(null);
            if (claim != null && ("APPROVED".equals(claim.getStatus()) || "PARTIALLY_APPROVED".equals(claim.getStatus()))) {
                claim.setStatus("PAID");
                claim.setPaidInPayrollId(payrollId);
                claim.setPaidAt(LocalDateTime.now());
                repository.save(claim);
            }
        }
    }

    public BigDecimal getEmployeePendingReimbursements(Long employeeId) {
        List<Reimbursement> approved = repository.findApprovedUnpaidByEmployee(employeeId);
        return approved.stream()
            .map(r -> r.getApprovedAmount() != null ? r.getApprovedAmount() : r.getAmount())
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
