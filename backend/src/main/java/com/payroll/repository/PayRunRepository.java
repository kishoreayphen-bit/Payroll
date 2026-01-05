package com.payroll.repository;

import com.payroll.entity.PayRun;
import com.payroll.entity.PayRun.PayRunStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PayRunRepository extends JpaRepository<PayRun, Long> {

    List<PayRun> findByTenantIdOrderByCreatedAtDesc(Long tenantId);

    List<PayRun> findByTenantIdAndStatus(Long tenantId, PayRunStatus status);

    Optional<PayRun> findByIdAndTenantId(Long id, Long tenantId);

    Optional<PayRun> findByPayRunNumber(String payRunNumber);

    @Query("SELECT p FROM PayRun p WHERE p.tenantId = :tenantId AND p.payPeriodStart = :start AND p.payPeriodEnd = :end")
    Optional<PayRun> findByTenantIdAndPayPeriod(@Param("tenantId") Long tenantId, 
                                                  @Param("start") LocalDate start, 
                                                  @Param("end") LocalDate end);

    @Query("SELECT p FROM PayRun p WHERE p.tenantId = :tenantId AND p.status IN :statuses ORDER BY p.createdAt DESC")
    List<PayRun> findByTenantIdAndStatusIn(@Param("tenantId") Long tenantId, 
                                            @Param("statuses") List<PayRunStatus> statuses);

    @Query("SELECT COUNT(p) FROM PayRun p WHERE p.tenantId = :tenantId AND YEAR(p.payPeriodStart) = :year")
    Long countByTenantIdAndYear(@Param("tenantId") Long tenantId, @Param("year") int year);
}
