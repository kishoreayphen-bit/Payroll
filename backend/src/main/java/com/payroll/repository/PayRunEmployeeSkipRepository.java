package com.payroll.repository;

import com.payroll.entity.PayRunEmployeeSkip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PayRunEmployeeSkipRepository extends JpaRepository<PayRunEmployeeSkip, Long> {

    List<PayRunEmployeeSkip> findByPayRunIdAndTenantId(Long payRunId, Long tenantId);

    Optional<PayRunEmployeeSkip> findByPayRunIdAndEmployeeIdAndTenantId(Long payRunId, Long employeeId, Long tenantId);

    List<PayRunEmployeeSkip> findByEmployeeIdAndTenantId(Long employeeId, Long tenantId);

    List<PayRunEmployeeSkip> findByEmployeeIdAndSkipTypeAndProcessedInPayRunIdIsNull(Long employeeId,
            PayRunEmployeeSkip.SkipType skipType);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query(value = "UPDATE pay_run_employee_skips SET processed_in_pay_run_id = NULL WHERE processed_in_pay_run_id = :payRunId", nativeQuery = true)
    void releaseArrears(@org.springframework.data.repository.query.Param("payRunId") Long payRunId);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query(value = "DELETE FROM pay_run_employee_skips WHERE pay_run_id = :payRunId", nativeQuery = true)
    void deleteByPayRunId(@org.springframework.data.repository.query.Param("payRunId") Long payRunId);
}
