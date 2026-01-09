package com.payroll.service;

import com.payroll.dto.TaxCalculationDTO;
import com.payroll.dto.TaxDeclarationDTO;
import com.payroll.entity.*;
import com.payroll.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Month;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TDSCalculationService {

    private final TaxDeclarationRepository taxDeclarationRepository;
    private final EmployeeRepository employeeRepository;
    private final EmployeeStatutoryInfoRepository employeeStatutoryInfoRepository;
    private final StatutorySettingsRepository statutorySettingsRepository;

    // Tax constants
    private static final BigDecimal STANDARD_DEDUCTION = new BigDecimal("50000");
    private static final BigDecimal REBATE_87A_LIMIT_OLD = new BigDecimal("500000");
    private static final BigDecimal REBATE_87A_LIMIT_NEW = new BigDecimal("700000");
    private static final BigDecimal REBATE_87A_AMOUNT = new BigDecimal("12500");
    private static final BigDecimal REBATE_87A_AMOUNT_NEW = new BigDecimal("25000");
    private static final BigDecimal SECTION_80C_LIMIT = new BigDecimal("150000");
    private static final BigDecimal SECTION_80CCD_1B_LIMIT = new BigDecimal("50000");
    private static final BigDecimal SECTION_80D_SELF_LIMIT = new BigDecimal("25000");
    private static final BigDecimal SECTION_80D_PARENTS_LIMIT = new BigDecimal("25000");
    private static final BigDecimal SECTION_80D_SENIOR_LIMIT = new BigDecimal("50000");
    private static final BigDecimal SECTION_80TTA_LIMIT = new BigDecimal("10000");
    private static final BigDecimal SECTION_24_LIMIT = new BigDecimal("200000");
    private static final BigDecimal CESS_RATE = new BigDecimal("0.04");

    // ==================== TAX DECLARATION ====================

    @Transactional(readOnly = true)
    public TaxDeclarationDTO getTaxDeclaration(Long employeeId, String financialYear) {
        return taxDeclarationRepository.findByEmployeeIdAndFinancialYear(employeeId, financialYear)
                .map(this::convertToDTO)
                .orElse(createEmptyDeclaration(employeeId, financialYear));
    }

    @Transactional(readOnly = true)
    public List<TaxDeclarationDTO> getAllTaxDeclarations(Long tenantId, String financialYear) {
        return taxDeclarationRepository.findByTenantIdAndFinancialYear(tenantId, financialYear)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaxDeclarationDTO saveTaxDeclaration(Long employeeId, TaxDeclarationDTO dto) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        TaxDeclaration declaration = taxDeclarationRepository
                .findByEmployeeIdAndFinancialYear(employeeId, dto.getFinancialYear())
                .orElse(new TaxDeclaration());

        declaration.setEmployee(employee);
        declaration.setTenantId(employee.getOrganization().getId());
        declaration.setFinancialYear(dto.getFinancialYear());
        declaration.setTaxRegime(dto.getTaxRegime());

        // Section 80C
        declaration.setSection80cPpf(dto.getSection80cPpf());
        declaration.setSection80cElss(dto.getSection80cElss());
        declaration.setSection80cNsc(dto.getSection80cNsc());
        declaration.setSection80cLifeInsurance(dto.getSection80cLifeInsurance());
        declaration.setSection80cTuitionFees(dto.getSection80cTuitionFees());
        declaration.setSection80cHomeLoanPrincipal(dto.getSection80cHomeLoanPrincipal());
        declaration.setSection80cSukanyaSamriddhi(dto.getSection80cSukanyaSamriddhi());
        declaration.setSection80cFixedDeposit(dto.getSection80cFixedDeposit());
        declaration.setSection80cOthers(dto.getSection80cOthers());

        // Section 80CCD
        declaration.setSection80ccd1bNps(dto.getSection80ccd1bNps());
        declaration.setSection80ccd2EmployerNps(dto.getSection80ccd2EmployerNps());

        // Section 80D
        declaration.setSection80dSelfFamily(dto.getSection80dSelfFamily());
        declaration.setSection80dParents(dto.getSection80dParents());
        declaration.setSection80dPreventiveCheckup(dto.getSection80dPreventiveCheckup());

        // Other sections
        declaration.setSection80eEducationLoan(dto.getSection80eEducationLoan());
        declaration.setSection80gDonations(dto.getSection80gDonations());
        declaration.setSection80ttaInterest(dto.getSection80ttaInterest());
        declaration.setSection80uDisability(dto.getSection80uDisability());
        declaration.setSection80ddDependentDisability(dto.getSection80ddDependentDisability());
        declaration.setSection80ddbMedical(dto.getSection80ddbMedical());
        declaration.setSection80eeHomeLoanInterest(dto.getSection80eeHomeLoanInterest());
        declaration.setSection24HomeLoanInterest(dto.getSection24HomeLoanInterest());

        // HRA
        declaration.setRentPaidAnnual(dto.getRentPaidAnnual());
        declaration.setLandlordName(dto.getLandlordName());
        declaration.setLandlordPan(dto.getLandlordPan());
        declaration.setRentalAddress(dto.getRentalAddress());
        declaration.setIsMetroCity(dto.getIsMetroCity());

        // Other Income
        declaration.setOtherIncomeInterest(dto.getOtherIncomeInterest());
        declaration.setOtherIncomeRental(dto.getOtherIncomeRental());
        declaration.setOtherIncomeMisc(dto.getOtherIncomeMisc());

        // Previous Employer
        declaration.setPreviousEmployerIncome(dto.getPreviousEmployerIncome());
        declaration.setPreviousEmployerTds(dto.getPreviousEmployerTds());
        declaration.setPreviousEmployerPf(dto.getPreviousEmployerPf());
        declaration.setPreviousEmployerPt(dto.getPreviousEmployerPt());

        declaration.setStatus(dto.getStatus() != null ? dto.getStatus() : "DRAFT");

        declaration = taxDeclarationRepository.save(declaration);
        return convertToDTO(declaration);
    }

    @Transactional
    public TaxDeclarationDTO submitTaxDeclaration(Long employeeId, String financialYear) {
        TaxDeclaration declaration = taxDeclarationRepository
                .findByEmployeeIdAndFinancialYear(employeeId, financialYear)
                .orElseThrow(() -> new RuntimeException("Tax declaration not found"));

        declaration.setStatus("SUBMITTED");
        declaration.setSubmittedAt(java.time.LocalDateTime.now());
        declaration = taxDeclarationRepository.save(declaration);
        return convertToDTO(declaration);
    }

    // ==================== TAX CALCULATION ====================

    @Transactional(readOnly = true)
    public TaxCalculationDTO calculateTax(Long employeeId, String financialYear) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        TaxDeclaration declaration = taxDeclarationRepository
                .findByEmployeeIdAndFinancialYear(employeeId, financialYear)
                .orElse(new TaxDeclaration());

        EmployeeStatutoryInfo statutoryInfo = employeeStatutoryInfoRepository
                .findByEmployeeId(employeeId)
                .orElse(new EmployeeStatutoryInfo());

        String taxRegime = statutoryInfo.getTaxRegime() != null ? statutoryInfo.getTaxRegime() : "NEW";

        TaxCalculationDTO result = new TaxCalculationDTO();
        result.setEmployeeId(employeeId);
        result.setEmployeeName(employee.getFullName());
        result.setFinancialYear(financialYear);
        result.setTaxRegime(taxRegime);

        // Calculate annual salary
        BigDecimal annualBasic = employee.getBasicMonthly() != null ? 
                employee.getBasicMonthly().multiply(BigDecimal.valueOf(12)) : BigDecimal.ZERO;
        BigDecimal annualHra = employee.getHraMonthly() != null ? 
                employee.getHraMonthly().multiply(BigDecimal.valueOf(12)) : BigDecimal.ZERO;
        BigDecimal annualAllowance = BigDecimal.ZERO;
        if (employee.getConveyanceAllowanceMonthly() != null) {
            annualAllowance = annualAllowance.add(employee.getConveyanceAllowanceMonthly().multiply(BigDecimal.valueOf(12)));
        }
        if (employee.getFixedAllowanceMonthly() != null) {
            annualAllowance = annualAllowance.add(employee.getFixedAllowanceMonthly().multiply(BigDecimal.valueOf(12)));
        }

        BigDecimal grossSalary = annualBasic.add(annualHra).add(annualAllowance);
        
        // Add previous employer income
        if (declaration.getPreviousEmployerIncome() != null) {
            grossSalary = grossSalary.add(declaration.getPreviousEmployerIncome());
        }

        // Add other income
        BigDecimal otherIncome = BigDecimal.ZERO;
        if (declaration.getOtherIncomeInterest() != null) otherIncome = otherIncome.add(declaration.getOtherIncomeInterest());
        if (declaration.getOtherIncomeRental() != null) otherIncome = otherIncome.add(declaration.getOtherIncomeRental());
        if (declaration.getOtherIncomeMisc() != null) otherIncome = otherIncome.add(declaration.getOtherIncomeMisc());

        result.setGrossSalary(grossSalary);
        result.setBasicSalary(annualBasic);
        result.setHra(annualHra);
        result.setSpecialAllowance(annualAllowance);
        result.setOtherIncome(otherIncome);
        result.setTotalGrossIncome(grossSalary.add(otherIncome));

        // Calculate exemptions and deductions based on regime
        if ("OLD".equalsIgnoreCase(taxRegime)) {
            calculateOldRegimeTax(result, employee, declaration, annualBasic, annualHra);
        } else {
            calculateNewRegimeTax(result, employee, declaration);
        }

        // Calculate remaining months and monthly TDS
        int currentMonth = LocalDate.now().getMonthValue();
        int remainingMonths = currentMonth >= 4 ? (16 - currentMonth) : (4 - currentMonth);
        if (remainingMonths <= 0) remainingMonths = 1;

        result.setRemainingMonths(remainingMonths);

        BigDecimal taxAlreadyPaid = declaration.getPreviousEmployerTds() != null ? 
                declaration.getPreviousEmployerTds() : BigDecimal.ZERO;
        result.setTaxAlreadyPaid(taxAlreadyPaid);

        BigDecimal remainingTax = result.getTotalTaxLiability().subtract(taxAlreadyPaid);
        if (remainingTax.compareTo(BigDecimal.ZERO) < 0) remainingTax = BigDecimal.ZERO;
        result.setRemainingTax(remainingTax);

        BigDecimal monthlyTds = remainingTax.divide(BigDecimal.valueOf(remainingMonths), 0, RoundingMode.CEILING);
        result.setMonthlyTds(monthlyTds);

        return result;
    }

    private void calculateOldRegimeTax(TaxCalculationDTO result, Employee employee, 
                                        TaxDeclaration declaration, BigDecimal annualBasic, BigDecimal annualHra) {
        BigDecimal totalGross = result.getTotalGrossIncome();

        // Standard Deduction
        result.setStandardDeduction(STANDARD_DEDUCTION);

        // HRA Exemption
        BigDecimal hraExemption = calculateHRAExemption(annualBasic, annualHra, declaration);
        result.setHraExemption(hraExemption);

        // Professional Tax (annual)
        BigDecimal ptAnnual = BigDecimal.ZERO;
        if (employee.getProfessionalTax() != null && employee.getProfessionalTax()) {
            ptAnnual = new BigDecimal("2500"); // Max annual PT
        }
        result.setProfessionalTax(ptAnnual);

        // Chapter VI-A Deductions
        BigDecimal section80C = calculateSection80C(declaration);
        result.setSection80C(section80C);

        BigDecimal section80CCD1B = declaration.getSection80ccd1bNps() != null ? 
                declaration.getSection80ccd1bNps().min(SECTION_80CCD_1B_LIMIT) : BigDecimal.ZERO;
        result.setSection80CCD1B(section80CCD1B);

        BigDecimal section80D = calculateSection80D(declaration);
        result.setSection80D(section80D);

        BigDecimal section80E = declaration.getSection80eEducationLoan() != null ? 
                declaration.getSection80eEducationLoan() : BigDecimal.ZERO;
        result.setSection80E(section80E);

        BigDecimal section80G = declaration.getSection80gDonations() != null ? 
                declaration.getSection80gDonations() : BigDecimal.ZERO;
        result.setSection80G(section80G);

        BigDecimal section80TTA = declaration.getSection80ttaInterest() != null ? 
                declaration.getSection80ttaInterest().min(SECTION_80TTA_LIMIT) : BigDecimal.ZERO;
        result.setSection80TTA(section80TTA);

        BigDecimal section24 = declaration.getSection24HomeLoanInterest() != null ? 
                declaration.getSection24HomeLoanInterest().min(SECTION_24_LIMIT) : BigDecimal.ZERO;
        result.setSection24(section24);

        // Calculate other deductions
        BigDecimal otherDeductions = BigDecimal.ZERO;
        if (declaration.getSection80uDisability() != null) otherDeductions = otherDeductions.add(declaration.getSection80uDisability());
        if (declaration.getSection80ddDependentDisability() != null) otherDeductions = otherDeductions.add(declaration.getSection80ddDependentDisability());
        if (declaration.getSection80ddbMedical() != null) otherDeductions = otherDeductions.add(declaration.getSection80ddbMedical());
        result.setOtherDeductions(otherDeductions);

        BigDecimal totalChapterVIA = section80C.add(section80CCD1B).add(section80D).add(section80E)
                .add(section80G).add(section80TTA).add(otherDeductions);
        result.setTotalChapterVIADeductions(totalChapterVIA);

        // Taxable Income
        BigDecimal taxableIncome = totalGross
                .subtract(STANDARD_DEDUCTION)
                .subtract(hraExemption)
                .subtract(ptAnnual)
                .subtract(section24)
                .subtract(totalChapterVIA);

        if (taxableIncome.compareTo(BigDecimal.ZERO) < 0) taxableIncome = BigDecimal.ZERO;
        result.setTotalTaxableIncome(taxableIncome);

        // Calculate tax using old regime slabs
        BigDecimal tax = calculateOldRegimeTaxSlabs(taxableIncome, result);
        result.setTaxBeforeRebate(tax);

        // Rebate 87A
        BigDecimal rebate = BigDecimal.ZERO;
        if (taxableIncome.compareTo(REBATE_87A_LIMIT_OLD) <= 0) {
            rebate = tax.min(REBATE_87A_AMOUNT);
        }
        result.setRebate87A(rebate);
        result.setTaxAfterRebate(tax.subtract(rebate));

        // Surcharge (if applicable)
        BigDecimal surcharge = calculateSurcharge(taxableIncome, tax.subtract(rebate));
        result.setSurcharge(surcharge);

        // Education Cess (4%)
        BigDecimal taxPlusSurcharge = tax.subtract(rebate).add(surcharge);
        BigDecimal cess = taxPlusSurcharge.multiply(CESS_RATE).setScale(0, RoundingMode.HALF_UP);
        result.setEducationCess(cess);

        result.setTotalTaxLiability(taxPlusSurcharge.add(cess));
    }

    private void calculateNewRegimeTax(TaxCalculationDTO result, Employee employee, TaxDeclaration declaration) {
        BigDecimal totalGross = result.getTotalGrossIncome();

        // Standard Deduction (75,000 in new regime from FY 2024-25)
        BigDecimal standardDeduction = new BigDecimal("75000");
        result.setStandardDeduction(standardDeduction);

        // No HRA exemption in new regime
        result.setHraExemption(BigDecimal.ZERO);

        // Professional Tax
        BigDecimal ptAnnual = BigDecimal.ZERO;
        if (employee.getProfessionalTax() != null && employee.getProfessionalTax()) {
            ptAnnual = new BigDecimal("2500");
        }
        result.setProfessionalTax(ptAnnual);

        // Limited deductions in new regime
        result.setSection80C(BigDecimal.ZERO);
        result.setSection80CCD1B(BigDecimal.ZERO);
        result.setSection80D(BigDecimal.ZERO);
        result.setSection80E(BigDecimal.ZERO);
        result.setSection80G(BigDecimal.ZERO);
        result.setSection80TTA(BigDecimal.ZERO);
        result.setSection24(BigDecimal.ZERO);
        result.setOtherDeductions(BigDecimal.ZERO);
        result.setTotalChapterVIADeductions(BigDecimal.ZERO);

        // Taxable Income
        BigDecimal taxableIncome = totalGross.subtract(standardDeduction);
        if (taxableIncome.compareTo(BigDecimal.ZERO) < 0) taxableIncome = BigDecimal.ZERO;
        result.setTotalTaxableIncome(taxableIncome);

        // Calculate tax using new regime slabs
        BigDecimal tax = calculateNewRegimeTaxSlabs(taxableIncome, result);
        result.setTaxBeforeRebate(tax);

        // Rebate 87A (higher limit in new regime)
        BigDecimal rebate = BigDecimal.ZERO;
        if (taxableIncome.compareTo(REBATE_87A_LIMIT_NEW) <= 0) {
            rebate = tax.min(REBATE_87A_AMOUNT_NEW);
        }
        result.setRebate87A(rebate);
        result.setTaxAfterRebate(tax.subtract(rebate));

        // Surcharge
        BigDecimal surcharge = calculateSurcharge(taxableIncome, tax.subtract(rebate));
        result.setSurcharge(surcharge);

        // Education Cess
        BigDecimal taxPlusSurcharge = tax.subtract(rebate).add(surcharge);
        BigDecimal cess = taxPlusSurcharge.multiply(CESS_RATE).setScale(0, RoundingMode.HALF_UP);
        result.setEducationCess(cess);

        result.setTotalTaxLiability(taxPlusSurcharge.add(cess));
    }

    private BigDecimal calculateOldRegimeTaxSlabs(BigDecimal taxableIncome, TaxCalculationDTO result) {
        List<TaxCalculationDTO.TaxSlabDetail> slabs = new ArrayList<>();
        BigDecimal tax = BigDecimal.ZERO;
        BigDecimal remaining = taxableIncome;

        // Slab 1: 0 - 2.5L (0%)
        BigDecimal slab1Limit = new BigDecimal("250000");
        if (remaining.compareTo(slab1Limit) <= 0) {
            slabs.add(createSlabDetail(BigDecimal.ZERO, slab1Limit, BigDecimal.ZERO, remaining, BigDecimal.ZERO));
            result.setTaxSlabDetails(slabs);
            return tax;
        }
        slabs.add(createSlabDetail(BigDecimal.ZERO, slab1Limit, BigDecimal.ZERO, slab1Limit, BigDecimal.ZERO));
        remaining = remaining.subtract(slab1Limit);

        // Slab 2: 2.5L - 5L (5%)
        BigDecimal slab2Limit = new BigDecimal("250000");
        BigDecimal slab2Rate = new BigDecimal("0.05");
        if (remaining.compareTo(slab2Limit) <= 0) {
            BigDecimal slabTax = remaining.multiply(slab2Rate).setScale(0, RoundingMode.HALF_UP);
            slabs.add(createSlabDetail(slab1Limit, new BigDecimal("500000"), new BigDecimal("5"), remaining, slabTax));
            result.setTaxSlabDetails(slabs);
            return tax.add(slabTax);
        }
        BigDecimal slab2Tax = slab2Limit.multiply(slab2Rate).setScale(0, RoundingMode.HALF_UP);
        slabs.add(createSlabDetail(slab1Limit, new BigDecimal("500000"), new BigDecimal("5"), slab2Limit, slab2Tax));
        tax = tax.add(slab2Tax);
        remaining = remaining.subtract(slab2Limit);

        // Slab 3: 5L - 10L (20%)
        BigDecimal slab3Limit = new BigDecimal("500000");
        BigDecimal slab3Rate = new BigDecimal("0.20");
        if (remaining.compareTo(slab3Limit) <= 0) {
            BigDecimal slabTax = remaining.multiply(slab3Rate).setScale(0, RoundingMode.HALF_UP);
            slabs.add(createSlabDetail(new BigDecimal("500000"), new BigDecimal("1000000"), new BigDecimal("20"), remaining, slabTax));
            result.setTaxSlabDetails(slabs);
            return tax.add(slabTax);
        }
        BigDecimal slab3Tax = slab3Limit.multiply(slab3Rate).setScale(0, RoundingMode.HALF_UP);
        slabs.add(createSlabDetail(new BigDecimal("500000"), new BigDecimal("1000000"), new BigDecimal("20"), slab3Limit, slab3Tax));
        tax = tax.add(slab3Tax);
        remaining = remaining.subtract(slab3Limit);

        // Slab 4: Above 10L (30%)
        BigDecimal slab4Rate = new BigDecimal("0.30");
        BigDecimal slab4Tax = remaining.multiply(slab4Rate).setScale(0, RoundingMode.HALF_UP);
        slabs.add(createSlabDetail(new BigDecimal("1000000"), null, new BigDecimal("30"), remaining, slab4Tax));
        tax = tax.add(slab4Tax);

        result.setTaxSlabDetails(slabs);
        return tax;
    }

    private BigDecimal calculateNewRegimeTaxSlabs(BigDecimal taxableIncome, TaxCalculationDTO result) {
        List<TaxCalculationDTO.TaxSlabDetail> slabs = new ArrayList<>();
        BigDecimal tax = BigDecimal.ZERO;
        BigDecimal remaining = taxableIncome;

        // New regime slabs (FY 2024-25 onwards)
        // 0 - 3L (0%)
        BigDecimal slab1Limit = new BigDecimal("300000");
        if (remaining.compareTo(slab1Limit) <= 0) {
            slabs.add(createSlabDetail(BigDecimal.ZERO, slab1Limit, BigDecimal.ZERO, remaining, BigDecimal.ZERO));
            result.setTaxSlabDetails(slabs);
            return tax;
        }
        slabs.add(createSlabDetail(BigDecimal.ZERO, slab1Limit, BigDecimal.ZERO, slab1Limit, BigDecimal.ZERO));
        remaining = remaining.subtract(slab1Limit);

        // 3L - 7L (5%)
        BigDecimal slab2Limit = new BigDecimal("400000");
        BigDecimal slab2Rate = new BigDecimal("0.05");
        if (remaining.compareTo(slab2Limit) <= 0) {
            BigDecimal slabTax = remaining.multiply(slab2Rate).setScale(0, RoundingMode.HALF_UP);
            slabs.add(createSlabDetail(slab1Limit, new BigDecimal("700000"), new BigDecimal("5"), remaining, slabTax));
            result.setTaxSlabDetails(slabs);
            return tax.add(slabTax);
        }
        BigDecimal slab2Tax = slab2Limit.multiply(slab2Rate).setScale(0, RoundingMode.HALF_UP);
        slabs.add(createSlabDetail(slab1Limit, new BigDecimal("700000"), new BigDecimal("5"), slab2Limit, slab2Tax));
        tax = tax.add(slab2Tax);
        remaining = remaining.subtract(slab2Limit);

        // 7L - 10L (10%)
        BigDecimal slab3Limit = new BigDecimal("300000");
        BigDecimal slab3Rate = new BigDecimal("0.10");
        if (remaining.compareTo(slab3Limit) <= 0) {
            BigDecimal slabTax = remaining.multiply(slab3Rate).setScale(0, RoundingMode.HALF_UP);
            slabs.add(createSlabDetail(new BigDecimal("700000"), new BigDecimal("1000000"), new BigDecimal("10"), remaining, slabTax));
            result.setTaxSlabDetails(slabs);
            return tax.add(slabTax);
        }
        BigDecimal slab3Tax = slab3Limit.multiply(slab3Rate).setScale(0, RoundingMode.HALF_UP);
        slabs.add(createSlabDetail(new BigDecimal("700000"), new BigDecimal("1000000"), new BigDecimal("10"), slab3Limit, slab3Tax));
        tax = tax.add(slab3Tax);
        remaining = remaining.subtract(slab3Limit);

        // 10L - 12L (15%)
        BigDecimal slab4Limit = new BigDecimal("200000");
        BigDecimal slab4Rate = new BigDecimal("0.15");
        if (remaining.compareTo(slab4Limit) <= 0) {
            BigDecimal slabTax = remaining.multiply(slab4Rate).setScale(0, RoundingMode.HALF_UP);
            slabs.add(createSlabDetail(new BigDecimal("1000000"), new BigDecimal("1200000"), new BigDecimal("15"), remaining, slabTax));
            result.setTaxSlabDetails(slabs);
            return tax.add(slabTax);
        }
        BigDecimal slab4Tax = slab4Limit.multiply(slab4Rate).setScale(0, RoundingMode.HALF_UP);
        slabs.add(createSlabDetail(new BigDecimal("1000000"), new BigDecimal("1200000"), new BigDecimal("15"), slab4Limit, slab4Tax));
        tax = tax.add(slab4Tax);
        remaining = remaining.subtract(slab4Limit);

        // 12L - 15L (20%)
        BigDecimal slab5Limit = new BigDecimal("300000");
        BigDecimal slab5Rate = new BigDecimal("0.20");
        if (remaining.compareTo(slab5Limit) <= 0) {
            BigDecimal slabTax = remaining.multiply(slab5Rate).setScale(0, RoundingMode.HALF_UP);
            slabs.add(createSlabDetail(new BigDecimal("1200000"), new BigDecimal("1500000"), new BigDecimal("20"), remaining, slabTax));
            result.setTaxSlabDetails(slabs);
            return tax.add(slabTax);
        }
        BigDecimal slab5Tax = slab5Limit.multiply(slab5Rate).setScale(0, RoundingMode.HALF_UP);
        slabs.add(createSlabDetail(new BigDecimal("1200000"), new BigDecimal("1500000"), new BigDecimal("20"), slab5Limit, slab5Tax));
        tax = tax.add(slab5Tax);
        remaining = remaining.subtract(slab5Limit);

        // Above 15L (30%)
        BigDecimal slab6Rate = new BigDecimal("0.30");
        BigDecimal slab6Tax = remaining.multiply(slab6Rate).setScale(0, RoundingMode.HALF_UP);
        slabs.add(createSlabDetail(new BigDecimal("1500000"), null, new BigDecimal("30"), remaining, slab6Tax));
        tax = tax.add(slab6Tax);

        result.setTaxSlabDetails(slabs);
        return tax;
    }

    private TaxCalculationDTO.TaxSlabDetail createSlabDetail(BigDecimal from, BigDecimal to, 
                                                              BigDecimal rate, BigDecimal amount, BigDecimal tax) {
        TaxCalculationDTO.TaxSlabDetail detail = new TaxCalculationDTO.TaxSlabDetail();
        detail.setFromAmount(from);
        detail.setToAmount(to);
        detail.setRate(rate);
        detail.setTaxableAmount(amount);
        detail.setTaxAmount(tax);
        return detail;
    }

    private BigDecimal calculateHRAExemption(BigDecimal annualBasic, BigDecimal annualHra, TaxDeclaration declaration) {
        if (declaration.getRentPaidAnnual() == null || declaration.getRentPaidAnnual().compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal actualHra = annualHra;
        BigDecimal rentPaid = declaration.getRentPaidAnnual();
        BigDecimal tenPercentBasic = annualBasic.multiply(new BigDecimal("0.10"));
        BigDecimal rentMinusBasic = rentPaid.subtract(tenPercentBasic);
        if (rentMinusBasic.compareTo(BigDecimal.ZERO) < 0) rentMinusBasic = BigDecimal.ZERO;

        BigDecimal fiftyOrFortyPercent = declaration.getIsMetroCity() != null && declaration.getIsMetroCity() ? 
                annualBasic.multiply(new BigDecimal("0.50")) : annualBasic.multiply(new BigDecimal("0.40"));

        return actualHra.min(rentMinusBasic).min(fiftyOrFortyPercent);
    }

    private BigDecimal calculateSection80C(TaxDeclaration declaration) {
        BigDecimal total = declaration.getTotal80C();
        // Add employer PF contribution (max 1.5L total)
        return total.min(SECTION_80C_LIMIT);
    }

    private BigDecimal calculateSection80D(TaxDeclaration declaration) {
        BigDecimal selfFamily = declaration.getSection80dSelfFamily() != null ? 
                declaration.getSection80dSelfFamily().min(SECTION_80D_SELF_LIMIT) : BigDecimal.ZERO;
        BigDecimal parents = declaration.getSection80dParents() != null ? 
                declaration.getSection80dParents().min(SECTION_80D_PARENTS_LIMIT) : BigDecimal.ZERO;
        BigDecimal checkup = declaration.getSection80dPreventiveCheckup() != null ? 
                declaration.getSection80dPreventiveCheckup().min(new BigDecimal("5000")) : BigDecimal.ZERO;
        
        return selfFamily.add(parents).add(checkup);
    }

    private BigDecimal calculateSurcharge(BigDecimal taxableIncome, BigDecimal tax) {
        if (taxableIncome.compareTo(new BigDecimal("5000000")) <= 0) {
            return BigDecimal.ZERO;
        } else if (taxableIncome.compareTo(new BigDecimal("10000000")) <= 0) {
            return tax.multiply(new BigDecimal("0.10")).setScale(0, RoundingMode.HALF_UP);
        } else if (taxableIncome.compareTo(new BigDecimal("20000000")) <= 0) {
            return tax.multiply(new BigDecimal("0.15")).setScale(0, RoundingMode.HALF_UP);
        } else if (taxableIncome.compareTo(new BigDecimal("50000000")) <= 0) {
            return tax.multiply(new BigDecimal("0.25")).setScale(0, RoundingMode.HALF_UP);
        } else {
            return tax.multiply(new BigDecimal("0.37")).setScale(0, RoundingMode.HALF_UP);
        }
    }

    // ==================== MONTHLY TDS CALCULATION ====================

    public BigDecimal calculateMonthlyTDS(Long employeeId, String financialYear) {
        TaxCalculationDTO taxCalc = calculateTax(employeeId, financialYear);
        return taxCalc.getMonthlyTds();
    }

    // ==================== CONVERTERS ====================

    private TaxDeclarationDTO convertToDTO(TaxDeclaration entity) {
        TaxDeclarationDTO dto = new TaxDeclarationDTO();
        dto.setId(entity.getId());
        dto.setEmployeeId(entity.getEmployee().getId());
        dto.setEmployeeName(entity.getEmployee().getFullName());
        dto.setTenantId(entity.getTenantId());
        dto.setFinancialYear(entity.getFinancialYear());
        dto.setTaxRegime(entity.getTaxRegime());

        // Section 80C
        dto.setSection80cPpf(entity.getSection80cPpf());
        dto.setSection80cElss(entity.getSection80cElss());
        dto.setSection80cNsc(entity.getSection80cNsc());
        dto.setSection80cLifeInsurance(entity.getSection80cLifeInsurance());
        dto.setSection80cTuitionFees(entity.getSection80cTuitionFees());
        dto.setSection80cHomeLoanPrincipal(entity.getSection80cHomeLoanPrincipal());
        dto.setSection80cSukanyaSamriddhi(entity.getSection80cSukanyaSamriddhi());
        dto.setSection80cFixedDeposit(entity.getSection80cFixedDeposit());
        dto.setSection80cOthers(entity.getSection80cOthers());
        dto.setTotal80C(entity.getTotal80C());

        // Section 80CCD
        dto.setSection80ccd1bNps(entity.getSection80ccd1bNps());
        dto.setSection80ccd2EmployerNps(entity.getSection80ccd2EmployerNps());

        // Section 80D
        dto.setSection80dSelfFamily(entity.getSection80dSelfFamily());
        dto.setSection80dParents(entity.getSection80dParents());
        dto.setSection80dPreventiveCheckup(entity.getSection80dPreventiveCheckup());
        dto.setTotal80D(entity.getTotal80D());

        // Other sections
        dto.setSection80eEducationLoan(entity.getSection80eEducationLoan());
        dto.setSection80gDonations(entity.getSection80gDonations());
        dto.setSection80ttaInterest(entity.getSection80ttaInterest());
        dto.setSection80uDisability(entity.getSection80uDisability());
        dto.setSection80ddDependentDisability(entity.getSection80ddDependentDisability());
        dto.setSection80ddbMedical(entity.getSection80ddbMedical());
        dto.setSection80eeHomeLoanInterest(entity.getSection80eeHomeLoanInterest());
        dto.setSection24HomeLoanInterest(entity.getSection24HomeLoanInterest());

        // HRA
        dto.setRentPaidAnnual(entity.getRentPaidAnnual());
        dto.setLandlordName(entity.getLandlordName());
        dto.setLandlordPan(entity.getLandlordPan());
        dto.setRentalAddress(entity.getRentalAddress());
        dto.setIsMetroCity(entity.getIsMetroCity());

        // Other Income
        dto.setOtherIncomeInterest(entity.getOtherIncomeInterest());
        dto.setOtherIncomeRental(entity.getOtherIncomeRental());
        dto.setOtherIncomeMisc(entity.getOtherIncomeMisc());

        // Previous Employer
        dto.setPreviousEmployerIncome(entity.getPreviousEmployerIncome());
        dto.setPreviousEmployerTds(entity.getPreviousEmployerTds());
        dto.setPreviousEmployerPf(entity.getPreviousEmployerPf());
        dto.setPreviousEmployerPt(entity.getPreviousEmployerPt());

        // Status
        dto.setStatus(entity.getStatus());
        dto.setSubmittedAt(entity.getSubmittedAt());
        dto.setVerifiedAt(entity.getVerifiedAt());

        return dto;
    }

    private TaxDeclarationDTO createEmptyDeclaration(Long employeeId, String financialYear) {
        TaxDeclarationDTO dto = new TaxDeclarationDTO();
        dto.setEmployeeId(employeeId);
        dto.setFinancialYear(financialYear);
        dto.setTaxRegime("NEW");
        dto.setStatus("DRAFT");
        return dto;
    }
}
