package com.payroll.repository;

import com.payroll.entity.PaySchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PayScheduleRepository extends JpaRepository<PaySchedule, Long> {
    
    List<PaySchedule> findByOrganizationIdAndIsActiveTrue(Long organizationId);
    
    List<PaySchedule> findByOrganizationId(Long organizationId);
    
    Optional<PaySchedule> findByOrganizationIdAndIsDefaultTrue(Long organizationId);
    
    Optional<PaySchedule> findByIdAndOrganizationId(Long id, Long organizationId);
    
    boolean existsByOrganizationIdAndScheduleNameAndIdNot(Long organizationId, String scheduleName, Long id);
    
    boolean existsByOrganizationIdAndScheduleName(Long organizationId, String scheduleName);
}
