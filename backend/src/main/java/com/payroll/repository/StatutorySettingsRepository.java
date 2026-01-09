package com.payroll.repository;

import com.payroll.entity.StatutorySettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StatutorySettingsRepository extends JpaRepository<StatutorySettings, Long> {
    Optional<StatutorySettings> findByTenantId(Long tenantId);
}
