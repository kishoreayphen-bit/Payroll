package com.payroll.repository;

import com.payroll.entity.TaxDeclaration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaxDeclarationRepository extends JpaRepository<TaxDeclaration, Long> {
    Optional<TaxDeclaration> findByEmployeeIdAndFinancialYear(Long employeeId, String financialYear);
    List<TaxDeclaration> findByTenantIdAndFinancialYear(Long tenantId, String financialYear);
    List<TaxDeclaration> findByEmployeeIdOrderByFinancialYearDesc(Long employeeId);
    List<TaxDeclaration> findByTenantIdAndFinancialYearAndStatus(Long tenantId, String financialYear, String status);
}
