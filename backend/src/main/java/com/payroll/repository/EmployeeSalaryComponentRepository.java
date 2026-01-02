package com.payroll.repository;

import com.payroll.entity.EmployeeSalaryComponent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeSalaryComponentRepository extends JpaRepository<EmployeeSalaryComponent, Long> {

    // Find all active components for an employee
    List<EmployeeSalaryComponent> findByEmployeeIdAndIsActiveTrue(Long employeeId);

    // Find active components for an employee on a specific date
    @Query("SELECT esc FROM EmployeeSalaryComponent esc " +
            "WHERE esc.employee.id = :employeeId " +
            "AND esc.isActive = true " +
            "AND esc.effectiveFrom <= :date " +
            "AND (esc.effectiveTo IS NULL OR esc.effectiveTo >= :date)")
    List<EmployeeSalaryComponent> findActiveComponentsForEmployeeOnDate(
            @Param("employeeId") Long employeeId,
            @Param("date") LocalDate date);

    // Find specific component assignment for an employee
    Optional<EmployeeSalaryComponent> findByEmployeeIdAndComponentIdAndIsActiveTrue(
            Long employeeId, Long componentId);

    // Find all employees with a specific component
    List<EmployeeSalaryComponent> findByComponentIdAndIsActiveTrue(Long componentId);

    // Check if employee has a specific component
    boolean existsByEmployeeIdAndComponentIdAndIsActiveTrue(Long employeeId, Long componentId);

    // Delete all components for an employee
    void deleteByEmployeeId(Long employeeId);
}
