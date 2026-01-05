package com.payroll.service;

import com.payroll.entity.Employee;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class ProfessionalTaxService {

    /**
     * Calculates Professional Tax based on Employee's state and Gross Salary.
     * Currently implements Tamil Nadu slabs as per user example.
     */
    public BigDecimal calculatePT(Employee employee, BigDecimal monthlyGrossSalary) {
        if (employee.getProfessionalTax() == null || !employee.getProfessionalTax()) {
            return BigDecimal.ZERO;
        }

        String state = employee.getWorkLocation() != null ? employee.getWorkLocation().trim() : "Tamil Nadu"; // Default
                                                                                                              // to TN
                                                                                                              // for now
                                                                                                              // if null

        // Normalize state check (simplified for now)
        if (state.equalsIgnoreCase("Tamil Nadu") || state.equalsIgnoreCase("TN") || state.equalsIgnoreCase("Chennai")) {
            return calculateTN_PT(monthlyGrossSalary);
        }

        // Default fallback (or 0 if strictly strict)
        // For now, let's treat everyone under TN rules for this MVP unless specified
        // otherwise
        return calculateTN_PT(monthlyGrossSalary);
    }

    private BigDecimal calculateTN_PT(BigDecimal grossSalary) {
        if (grossSalary == null)
            return BigDecimal.ZERO;
        double salary = grossSalary.doubleValue();

        if (salary < 3500) {
            return BigDecimal.ZERO;
        } else if (salary <= 5000) {
            return BigDecimal.valueOf(22.5);
        } else if (salary <= 10000) {
            return BigDecimal.valueOf(52.5);
        } else {
            return BigDecimal.valueOf(208);
        }
    }
}
