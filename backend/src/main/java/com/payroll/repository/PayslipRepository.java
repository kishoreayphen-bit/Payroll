package com.payroll.repository;

import com.payroll.entity.Payslip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PayslipRepository extends JpaRepository<Payslip, Long> {

    List<Payslip> findByEmployeeIdOrderByPayPeriodEndDesc(Long employeeId);

    List<Payslip> findByTenantIdOrderByCreatedAtDesc(Long tenantId);

    Optional<Payslip> findByPayslipNumber(String payslipNumber);

    Optional<Payslip> findByIdAndEmployeeId(Long id, Long employeeId);

    Optional<Payslip> findByPayRunEmployeeId(Long payRunEmployeeId);

    @Query("SELECT p FROM Payslip p WHERE p.employee.id = :employeeId AND YEAR(p.payPeriodStart) = :year ORDER BY p.payPeriodStart")
    List<Payslip> findByEmployeeIdAndYear(@Param("employeeId") Long employeeId, @Param("year") int year);

    @Query("SELECT p FROM Payslip p WHERE p.tenantId = :tenantId AND p.payPeriodStart >= :start AND p.payPeriodEnd <= :end")
    List<Payslip> findByTenantIdAndPeriod(@Param("tenantId") Long tenantId, 
                                           @Param("start") LocalDate start, 
                                           @Param("end") LocalDate end);

    @Query("SELECT COUNT(p) FROM Payslip p WHERE p.tenantId = :tenantId AND p.emailSent = false")
    Long countPendingEmailsByTenantId(@Param("tenantId") Long tenantId);
}
