package com.payroll.repository;

import com.payroll.entity.PFConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PFConfigurationRepository extends JpaRepository<PFConfiguration, Long> {
    Optional<PFConfiguration> findByOrganizationId(Long organizationId);
}
