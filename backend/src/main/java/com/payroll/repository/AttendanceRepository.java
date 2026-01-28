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

    // Prefer date range queries to avoid DB-specific MONTH/YEAR JPQL functions
    default List<Attendance> findByOrganizationIdAndMonthYear(Long organizationId, int month, int year) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());
        return findByOrganizationIdAndDateBetween(organizationId, start, end);
    }

    default List<Attendance> findByEmployeeIdAndMonthYear(Long employeeId, int month, int year) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());
        return findByEmployeeIdAndDateBetween(employeeId, start, end);
    }
}
