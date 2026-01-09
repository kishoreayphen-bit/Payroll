package com.payroll.repository;

import com.payroll.entity.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {

    List<Loan> findByOrganizationId(Long organizationId);

    List<Loan> findByEmployeeId(Long employeeId);

    List<Loan> findByOrganizationIdAndStatus(Long organizationId, String status);

    List<Loan> findByEmployeeIdAndStatus(Long employeeId, String status);

    @Query("SELECT l FROM Loan l WHERE l.organizationId = :orgId AND l.status IN ('ACTIVE', 'DISBURSED') AND l.deductFromSalary = true")
    List<Loan> findActiveLoansForDeduction(@Param("orgId") Long organizationId);

    @Query("SELECT l FROM Loan l WHERE l.employeeId = :empId AND l.status IN ('ACTIVE', 'DISBURSED') AND l.deductFromSalary = true")
    List<Loan> findEmployeeActiveLoansForDeduction(@Param("empId") Long employeeId);
}
