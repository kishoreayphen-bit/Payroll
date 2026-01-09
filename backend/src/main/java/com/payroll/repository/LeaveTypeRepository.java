package com.payroll.repository;

import com.payroll.entity.LeaveType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveTypeRepository extends JpaRepository<LeaveType, Long> {

    List<LeaveType> findByOrganizationId(Long organizationId);

    List<LeaveType> findByOrganizationIdAndIsActiveTrue(Long organizationId);

    LeaveType findByOrganizationIdAndCode(Long organizationId, String code);
}
