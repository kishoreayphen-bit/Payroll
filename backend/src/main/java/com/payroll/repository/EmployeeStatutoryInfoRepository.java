package com.payroll.repository;

import com.payroll.entity.EmployeeStatutoryInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeStatutoryInfoRepository extends JpaRepository<EmployeeStatutoryInfo, Long> {
    Optional<EmployeeStatutoryInfo> findByEmployeeId(Long employeeId);
    List<EmployeeStatutoryInfo> findByTenantId(Long tenantId);
    List<EmployeeStatutoryInfo> findByTenantIdAndIsPfApplicable(Long tenantId, Boolean isPfApplicable);
    List<EmployeeStatutoryInfo> findByTenantIdAndIsEsiApplicable(Long tenantId, Boolean isEsiApplicable);
}
