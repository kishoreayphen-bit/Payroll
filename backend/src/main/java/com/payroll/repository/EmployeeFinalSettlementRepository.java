package com.payroll.repository;

import com.payroll.entity.EmployeeFinalSettlement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeFinalSettlementRepository extends JpaRepository<EmployeeFinalSettlement, Long> {
    
    List<EmployeeFinalSettlement> findByOrganizationId(Long organizationId);
    
    Optional<EmployeeFinalSettlement> findByEmployeeId(Long employeeId);
    
    List<EmployeeFinalSettlement> findByOrganizationIdAndStatus(Long organizationId, String status);
    
    boolean existsByEmployeeId(Long employeeId);
}
