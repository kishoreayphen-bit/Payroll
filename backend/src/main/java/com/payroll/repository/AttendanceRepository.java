package com.payroll.repository;

import com.payroll.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByEmployeeIdAndOrganizationId(Long employeeId, Long organizationId);

    List<Attendance> findByOrganizationIdAndDateBetween(Long organizationId, LocalDate startDate, LocalDate endDate);

    List<Attendance> findByEmployeeIdAndDateBetween(Long employeeId, LocalDate startDate, LocalDate endDate);

    Optional<Attendance> findByEmployeeIdAndDate(Long employeeId, LocalDate date);

    @Query("SELECT a FROM Attendance a WHERE a.organizationId = :orgId AND a.date = :date")
    List<Attendance> findByOrganizationIdAndDate(@Param("orgId") Long organizationId, @Param("date") LocalDate date);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.employeeId = :empId AND a.status = :status AND a.date BETWEEN :start AND :end")
    Long countByEmployeeIdAndStatusAndDateBetween(@Param("empId") Long employeeId, @Param("status") String status, 
                                                   @Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT a FROM Attendance a WHERE a.organizationId = :orgId AND MONTH(a.date) = :month AND YEAR(a.date) = :year")
    List<Attendance> findByOrganizationIdAndMonthYear(@Param("orgId") Long organizationId, 
                                                       @Param("month") int month, @Param("year") int year);

    @Query("SELECT a FROM Attendance a WHERE a.employeeId = :empId AND MONTH(a.date) = :month AND YEAR(a.date) = :year")
    List<Attendance> findByEmployeeIdAndMonthYear(@Param("empId") Long employeeId, 
                                                   @Param("month") int month, @Param("year") int year);
}
