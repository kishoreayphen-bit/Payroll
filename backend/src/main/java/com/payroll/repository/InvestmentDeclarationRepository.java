package com.payroll.repository;

import com.payroll.entity.InvestmentDeclaration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvestmentDeclarationRepository extends JpaRepository<InvestmentDeclaration, Long> {

    List<InvestmentDeclaration> findByOrganizationId(Long organizationId);

    List<InvestmentDeclaration> findByEmployeeId(Long employeeId);

    Optional<InvestmentDeclaration> findByEmployeeIdAndFinancialYear(Long employeeId, String financialYear);

    List<InvestmentDeclaration> findByOrganizationIdAndFinancialYear(Long organizationId, String financialYear);

    List<InvestmentDeclaration> findByOrganizationIdAndStatus(Long organizationId, String status);
}
