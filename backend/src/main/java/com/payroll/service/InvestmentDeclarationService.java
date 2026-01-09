package com.payroll.service;

import com.payroll.entity.InvestmentDeclaration;
import com.payroll.repository.InvestmentDeclarationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class InvestmentDeclarationService {

    @Autowired
    private InvestmentDeclarationRepository repository;

    public List<InvestmentDeclaration> getByOrganization(Long organizationId) {
        return repository.findByOrganizationId(organizationId);
    }

    public List<InvestmentDeclaration> getByEmployee(Long employeeId) {
        return repository.findByEmployeeId(employeeId);
    }

    public Optional<InvestmentDeclaration> getByEmployeeAndYear(Long employeeId, String financialYear) {
        return repository.findByEmployeeIdAndFinancialYear(employeeId, financialYear);
    }

    public List<InvestmentDeclaration> getByOrganizationAndYear(Long organizationId, String financialYear) {
        return repository.findByOrganizationIdAndFinancialYear(organizationId, financialYear);
    }

    public List<InvestmentDeclaration> getPendingDeclarations(Long organizationId) {
        return repository.findByOrganizationIdAndStatus(organizationId, "SUBMITTED");
    }

    @Transactional
    public InvestmentDeclaration createOrUpdate(InvestmentDeclaration declaration) {
        Optional<InvestmentDeclaration> existing = repository.findByEmployeeIdAndFinancialYear(
            declaration.getEmployeeId(), declaration.getFinancialYear());
        
        if (existing.isPresent()) {
            InvestmentDeclaration e = existing.get();
            copyDeclarationFields(declaration, e);
            return repository.save(e);
        }
        
        return repository.save(declaration);
    }

    private void copyDeclarationFields(InvestmentDeclaration from, InvestmentDeclaration to) {
        to.setSec80cPpf(from.getSec80cPpf());
        to.setSec80cElss(from.getSec80cElss());
        to.setSec80cLifeInsurance(from.getSec80cLifeInsurance());
        to.setSec80cNsc(from.getSec80cNsc());
        to.setSec80cSukanyaSamriddhi(from.getSec80cSukanyaSamriddhi());
        to.setSec80cTuitionFees(from.getSec80cTuitionFees());
        to.setSec80cHomeLoanPrincipal(from.getSec80cHomeLoanPrincipal());
        to.setSec80cFd5yr(from.getSec80cFd5yr());
        to.setSec80cOthers(from.getSec80cOthers());
        to.setSec80ccdNpsEmployee(from.getSec80ccdNpsEmployee());
        to.setSec80ccdNpsEmployer(from.getSec80ccdNpsEmployer());
        to.setSec80ccd1bAdditional(from.getSec80ccd1bAdditional());
        to.setSec80dSelfFamily(from.getSec80dSelfFamily());
        to.setSec80dParents(from.getSec80dParents());
        to.setSec80dPreventiveCheckup(from.getSec80dPreventiveCheckup());
        to.setSec80eEducationLoan(from.getSec80eEducationLoan());
        to.setSec80gDonations(from.getSec80gDonations());
        to.setSec80eeHomeLoanInterest(from.getSec80eeHomeLoanInterest());
        to.setSec24HomeLoanInterest(from.getSec24HomeLoanInterest());
        to.setHraRentPaidAnnual(from.getHraRentPaidAnnual());
        to.setHraLandlordName(from.getHraLandlordName());
        to.setHraLandlordPan(from.getHraLandlordPan());
        to.setHraRentalAddress(from.getHraRentalAddress());
        to.setHraIsMetroCity(from.getHraIsMetroCity());
        to.setOtherIncomeInterest(from.getOtherIncomeInterest());
        to.setOtherIncomeRental(from.getOtherIncomeRental());
        to.setOtherIncomeOthers(from.getOtherIncomeOthers());
    }

    @Transactional
    public InvestmentDeclaration submit(Long id) {
        InvestmentDeclaration declaration = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Declaration not found"));
        
        declaration.setStatus("SUBMITTED");
        declaration.setSubmittedAt(LocalDateTime.now());
        return repository.save(declaration);
    }

    @Transactional
    public InvestmentDeclaration approve(Long id, Long approvedBy) {
        InvestmentDeclaration declaration = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Declaration not found"));
        
        declaration.setStatus("APPROVED");
        declaration.setApprovedBy(approvedBy);
        declaration.setApprovedAt(LocalDateTime.now());
        return repository.save(declaration);
    }

    @Transactional
    public InvestmentDeclaration reject(Long id, Long rejectedBy, String reason) {
        InvestmentDeclaration declaration = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Declaration not found"));
        
        declaration.setStatus("REJECTED");
        declaration.setApprovedBy(rejectedBy);
        declaration.setApprovedAt(LocalDateTime.now());
        declaration.setRemarks(reason);
        return repository.save(declaration);
    }

    public BigDecimal calculateTotalDeductions(Long employeeId, String financialYear) {
        Optional<InvestmentDeclaration> declaration = repository.findByEmployeeIdAndFinancialYear(employeeId, financialYear);
        return declaration.map(InvestmentDeclaration::getTotalDeductions).orElse(BigDecimal.ZERO);
    }
}
