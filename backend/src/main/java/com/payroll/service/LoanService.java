package com.payroll.service;

import com.payroll.entity.Loan;
import com.payroll.repository.LoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class LoanService {

    @Autowired
    private LoanRepository loanRepository;

    public List<Loan> getByOrganization(Long organizationId) {
        return loanRepository.findByOrganizationId(organizationId);
    }

    public List<Loan> getByEmployee(Long employeeId) {
        return loanRepository.findByEmployeeId(employeeId);
    }

    public List<Loan> getPendingLoans(Long organizationId) {
        return loanRepository.findByOrganizationIdAndStatus(organizationId, "PENDING");
    }

    public List<Loan> getActiveLoans(Long organizationId) {
        return loanRepository.findActiveLoansForDeduction(organizationId);
    }

    public List<Loan> getEmployeeActiveLoans(Long employeeId) {
        return loanRepository.findEmployeeActiveLoansForDeduction(employeeId);
    }

    @Transactional
    public Loan applyLoan(Loan loan) {
        loan.calculateEmi();
        loan.setStatus("PENDING");
        loan.setRequestedAt(LocalDateTime.now());
        return loanRepository.save(loan);
    }

    @Transactional
    public Loan approveLoan(Long loanId, Long approvedBy) {
        Loan loan = loanRepository.findById(loanId)
            .orElseThrow(() -> new RuntimeException("Loan not found"));
        
        loan.setStatus("APPROVED");
        loan.setApprovedBy(approvedBy);
        loan.setApprovedAt(LocalDateTime.now());
        return loanRepository.save(loan);
    }

    @Transactional
    public Loan rejectLoan(Long loanId, Long rejectedBy, String reason) {
        Loan loan = loanRepository.findById(loanId)
            .orElseThrow(() -> new RuntimeException("Loan not found"));
        
        loan.setStatus("REJECTED");
        loan.setApprovedBy(rejectedBy);
        loan.setApprovedAt(LocalDateTime.now());
        loan.setRejectionReason(reason);
        return loanRepository.save(loan);
    }

    @Transactional
    public Loan disburseLoan(Long loanId) {
        Loan loan = loanRepository.findById(loanId)
            .orElseThrow(() -> new RuntimeException("Loan not found"));
        
        loan.setStatus("DISBURSED");
        loan.setDisbursementDate(LocalDate.now());
        loan.setDisbursedAmount(loan.getPrincipalAmount());
        loan.setStartDate(LocalDate.now().plusMonths(1).withDayOfMonth(1));
        loan.setEndDate(loan.getStartDate().plusMonths(loan.getTenureMonths()));
        loan.setNextEmiDate(loan.getStartDate());
        
        return loanRepository.save(loan);
    }

    @Transactional
    public Loan recordEmiPayment(Long loanId, BigDecimal amount) {
        Loan loan = loanRepository.findById(loanId)
            .orElseThrow(() -> new RuntimeException("Loan not found"));
        
        loan.setPaidAmount(loan.getPaidAmount().add(amount));
        loan.setOutstandingAmount(loan.getOutstandingAmount().subtract(amount));
        loan.setPaidEmis(loan.getPaidEmis() + 1);
        loan.setPendingEmis(loan.getPendingEmis() - 1);
        
        if (loan.getPendingEmis() <= 0) {
            loan.setStatus("CLOSED");
            loan.setNextEmiDate(null);
        } else {
            loan.setNextEmiDate(loan.getNextEmiDate().plusMonths(1));
            if ("DISBURSED".equals(loan.getStatus())) {
                loan.setStatus("ACTIVE");
            }
        }
        
        return loanRepository.save(loan);
    }

    public BigDecimal getEmployeeMonthlyEmiDeduction(Long employeeId) {
        List<Loan> activeLoans = loanRepository.findEmployeeActiveLoansForDeduction(employeeId);
        return activeLoans.stream()
            .map(Loan::getEmiAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
