package com.payroll.repository;

import com.payroll.entity.SalaryComponent;
import com.payroll.enums.ComponentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SalaryComponentRepository extends JpaRepository<SalaryComponent, Long> {

    // Find all components for an organization
    List<SalaryComponent> findByOrganizationIdAndIsActiveTrue(Long organizationId);

    // Find by type (EARNING or DEDUCTION)
    List<SalaryComponent> findByOrganizationIdAndTypeAndIsActiveTrue(Long organizationId, ComponentType type);

    // Find by code
    Optional<SalaryComponent> findByOrganizationIdAndCode(Long organizationId, String code);

    // Find all active components ordered by display order
    List<SalaryComponent> findByOrganizationIdAndIsActiveTrueOrderByDisplayOrderAsc(Long organizationId);

    // Find statutory components
    List<SalaryComponent> findByOrganizationIdAndIsStatutoryTrueAndIsActiveTrue(Long organizationId);

    // Check if code exists
    boolean existsByOrganizationIdAndCode(Long organizationId, String code);
}
