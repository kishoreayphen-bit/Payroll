package com.payroll.repository;

import com.payroll.entity.Reimbursement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReimbursementRepository extends JpaRepository<Reimbursement, Long> {

    List<Reimbursement> findByOrganizationId(Long organizationId);

    List<Reimbursement> findByEmployeeId(Long employeeId);

    List<Reimbursement> findByOrganizationIdAndStatus(Long organizationId, String status);

    List<Reimbursement> findByEmployeeIdAndStatus(Long employeeId, String status);

    @Query("SELECT r FROM Reimbursement r WHERE r.organizationId = :orgId AND r.status = 'APPROVED' AND r.paidInPayrollId IS NULL")
    List<Reimbursement> findApprovedUnpaidByOrganization(@Param("orgId") Long organizationId);

    @Query("SELECT r FROM Reimbursement r WHERE r.employeeId = :empId AND r.status = 'APPROVED' AND r.paidInPayrollId IS NULL")
    List<Reimbursement> findApprovedUnpaidByEmployee(@Param("empId") Long employeeId);
}
