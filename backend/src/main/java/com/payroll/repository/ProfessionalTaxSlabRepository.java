package com.payroll.repository;

import com.payroll.entity.ProfessionalTaxSlab;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProfessionalTaxSlabRepository extends JpaRepository<ProfessionalTaxSlab, Long> {
    List<ProfessionalTaxSlab> findByStateAndIsActiveOrderByFromAmountAsc(String state, Boolean isActive);
    
    List<ProfessionalTaxSlab> findByStateAndFinancialYearAndIsActiveOrderByFromAmountAsc(
            String state, String financialYear, Boolean isActive);
    
    @Query("SELECT p FROM ProfessionalTaxSlab p WHERE p.state = :state AND p.isActive = true " +
           "AND p.fromAmount <= :salary AND (p.toAmount IS NULL OR p.toAmount >= :salary)")
    Optional<ProfessionalTaxSlab> findApplicableSlab(@Param("state") String state, @Param("salary") BigDecimal salary);
    
    List<ProfessionalTaxSlab> findByIsActiveOrderByStateAscFromAmountAsc(Boolean isActive);
    
    @Query("SELECT DISTINCT p.state FROM ProfessionalTaxSlab p WHERE p.isActive = true ORDER BY p.state")
    List<String> findAllActiveStates();
}
