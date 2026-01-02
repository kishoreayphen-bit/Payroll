package com.payroll.repository;

import com.payroll.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    // Find all employees by organization
    List<Employee> findByOrganizationId(Long organizationId);

    // Find employee by employee ID and organization
    Optional<Employee> findByEmployeeIdAndOrganizationId(String employeeId, Long organizationId);

    // Find employee by work email and organization
    Optional<Employee> findByWorkEmailAndOrganizationId(String workEmail, Long organizationId);

    // Find employees by department
    List<Employee> findByDepartmentAndOrganizationId(String department, Long organizationId);

    // Find employees by status
    List<Employee> findByStatusAndOrganizationId(String status, Long organizationId);

    // Check if employee ID exists in organization
    boolean existsByEmployeeIdAndOrganizationId(String employeeId, Long organizationId);

    // Check if work email exists in organization
    boolean existsByWorkEmailAndOrganizationId(String workEmail, Long organizationId);

    // Count employees by organization
    long countByOrganizationId(Long organizationId);

    // Count active employees by organization
    long countByOrganizationIdAndStatus(Long organizationId, String status);
}
