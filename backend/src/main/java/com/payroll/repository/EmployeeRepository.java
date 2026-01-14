package com.payroll.repository;

import com.payroll.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    // Find employee by full name (case-insensitive) and organization
    @Query("SELECT e FROM Employee e WHERE e.organization.id = :organizationId AND " +
           "(LOWER(CONCAT(e.firstName, ' ', COALESCE(e.middleName, ''), ' ', e.lastName)) LIKE LOWER(CONCAT('%', :name, '%')) OR " +
           "LOWER(CONCAT(e.firstName, ' ', e.lastName)) = LOWER(:name))")
    Optional<Employee> findByNameIgnoreCaseAndOrganizationId(@Param("name") String name, @Param("organizationId") Long organizationId);

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

    // Find employees by tenant ID (using organization_id as tenant)
    default List<Employee> findByTenantId(Long tenantId) {
        return findByOrganizationId(tenantId);
    }
}
