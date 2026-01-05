package com.payroll.repository;

import com.payroll.entity.PayRunEmployee;
import com.payroll.entity.PayRunEmployee.PayRunEmployeeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PayRunEmployeeRepository extends JpaRepository<PayRunEmployee, Long> {

    List<PayRunEmployee> findByPayRunId(Long payRunId);

    List<PayRunEmployee> findByPayRunIdAndStatus(Long payRunId, PayRunEmployeeStatus status);

    Optional<PayRunEmployee> findByPayRunIdAndEmployeeId(Long payRunId, Long employeeId);

    @Query("SELECT pre FROM PayRunEmployee pre WHERE pre.payRun.id = :payRunId ORDER BY pre.employee.firstName")
    List<PayRunEmployee> findByPayRunIdOrderByEmployeeName(@Param("payRunId") Long payRunId);

    @Query("SELECT COUNT(pre) FROM PayRunEmployee pre WHERE pre.payRun.id = :payRunId AND pre.status = :status")
    Long countByPayRunIdAndStatus(@Param("payRunId") Long payRunId, @Param("status") PayRunEmployeeStatus status);

    @Query("SELECT SUM(pre.netSalary) FROM PayRunEmployee pre WHERE pre.payRun.id = :payRunId")
    java.math.BigDecimal sumNetSalaryByPayRunId(@Param("payRunId") Long payRunId);
}
