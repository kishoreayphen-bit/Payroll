package com.payroll.repository;

import com.payroll.entity.Holiday;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HolidayRepository extends JpaRepository<Holiday, Long> {
    List<Holiday> findByOrganizationIdAndIsActiveTrue(Long organizationId);
    
    List<Holiday> findByOrganizationIdAndHolidayDateBetweenAndIsActiveTrue(
        Long organizationId, LocalDate startDate, LocalDate endDate);
    
    Optional<Holiday> findByOrganizationIdAndHolidayDate(Long organizationId, LocalDate date);
    
    @Query("SELECT h FROM Holiday h WHERE h.organizationId = :orgId AND YEAR(h.holidayDate) = :year AND h.isActive = true")
    List<Holiday> findByOrganizationIdAndYear(@Param("orgId") Long organizationId, @Param("year") int year);
    
    boolean existsByOrganizationIdAndHolidayDate(Long organizationId, LocalDate holidayDate);
}
