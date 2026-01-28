package com.payroll.service;

import com.payroll.dto.EmployeeRequestDTO;
import com.payroll.dto.EmployeeResponseDTO;
import com.payroll.dto.EmployeeExitDTO;
import com.payroll.dto.FinalSettlementDTO;
import com.payroll.entity.Employee;
import com.payroll.entity.EmployeeFinalSettlement;
import com.payroll.repository.EmployeeFinalSettlementRepository;
import com.payroll.organization.Organization;
import com.payroll.organization.OrganizationRepository;
import com.payroll.repository.EmployeeRepository;
import com.payroll.user.User;
import com.payroll.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployeeSalaryService employeeSalaryService;

    @Autowired
    private EmployeeFinalSettlementRepository finalSettlementRepository;

    @Transactional
    public EmployeeResponseDTO createEmployee(EmployeeRequestDTO requestDTO, String userEmail) {
        // Validate organization exists
        Organization organization = organizationRepository.findById(requestDTO.getOrganizationId())
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        // Get current user
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if employee ID already exists in organization
        if (employeeRepository.existsByEmployeeIdAndOrganizationId(
                requestDTO.getEmployeeId(), requestDTO.getOrganizationId())) {
            throw new RuntimeException("Employee ID already exists in this organization");
        }

        // Check if work email already exists in organization
        if (employeeRepository.existsByWorkEmailAndOrganizationId(
                requestDTO.getWorkEmail(), requestDTO.getOrganizationId())) {
            throw new RuntimeException("Work email already exists in this organization");
        }

        // Create employee entity
        Employee employee = new Employee();
        mapDTOToEntity(requestDTO, employee);
        employee.setOrganization(organization);
        employee.setCreatedBy(currentUser);

        // Save employee
        // Save employee
        Employee savedEmployee = employeeRepository.save(employee);

        // Sync Professional Tax Component
        employeeSalaryService.syncProfessionalTax(savedEmployee);

        return mapEntityToDTO(savedEmployee);
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponseDTO> getAllEmployeesByOrganization(Long organizationId) {
        List<Employee> employees = employeeRepository.findByOrganizationId(organizationId);
        return employees.stream()
                .map(this::mapEntityToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EmployeeResponseDTO getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return mapEntityToDTO(employee);
    }

    @Transactional
    public EmployeeResponseDTO updateEmployee(Long id, EmployeeRequestDTO requestDTO) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        // Check if employee ID is being changed and if it already exists
        if (!employee.getEmployeeId().equals(requestDTO.getEmployeeId())) {
            if (employeeRepository.existsByEmployeeIdAndOrganizationId(
                    requestDTO.getEmployeeId(), requestDTO.getOrganizationId())) {
                throw new RuntimeException("Employee ID already exists in this organization");
            }
        }

        // Check if work email is being changed and if it already exists
        if (!employee.getWorkEmail().equals(requestDTO.getWorkEmail())) {
            if (employeeRepository.existsByWorkEmailAndOrganizationId(
                    requestDTO.getWorkEmail(), requestDTO.getOrganizationId())) {
                throw new RuntimeException("Work email already exists in this organization");
            }
        }

        mapDTOToEntity(requestDTO, employee);
        Employee updatedEmployee = employeeRepository.save(employee);

        // Sync Professional Tax Component
        employeeSalaryService.syncProfessionalTax(updatedEmployee);

        return mapEntityToDTO(updatedEmployee);
    }

    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        employeeRepository.delete(employee);
    }

    // Helper methods
    private void mapDTOToEntity(EmployeeRequestDTO dto, Employee entity) {
        // Basic Details
        entity.setFirstName(dto.getFirstName());
        entity.setMiddleName(dto.getMiddleName());
        entity.setLastName(dto.getLastName());
        entity.setEmployeeId(dto.getEmployeeId());
        entity.setDateOfJoining(dto.getDateOfJoining());
        entity.setWorkEmail(dto.getWorkEmail());
        entity.setMobileNumber(dto.getMobileNumber());
        entity.setIsDirector(dto.getIsDirector());
        entity.setGender(dto.getGender());
        entity.setWorkLocation(dto.getWorkLocation());
        entity.setDesignation(dto.getDesignation());
        entity.setDepartment(dto.getDepartment());
        entity.setEnablePortalAccess(dto.getEnablePortalAccess());
        entity.setProfessionalTax(dto.getProfessionalTax());

        // Salary Details
        entity.setAnnualCtc(dto.getAnnualCtc());
        entity.setBasicPercentOfCtc(dto.getBasicPercentOfCtc());
        entity.setHraPercentOfBasic(dto.getHraPercentOfBasic());
        entity.setConveyanceAllowanceMonthly(dto.getConveyanceAllowanceMonthly());
        entity.setBasicMonthly(dto.getBasicMonthly());
        entity.setHraMonthly(dto.getHraMonthly());
        entity.setFixedAllowanceMonthly(dto.getFixedAllowanceMonthly());

        // Personal Details
        entity.setDateOfBirth(dto.getDateOfBirth());
        entity.setAge(dto.getAge());
        entity.setFatherName(dto.getFatherName());
        entity.setPersonalEmail(dto.getPersonalEmail());
        entity.setDifferentlyAbledType(dto.getDifferentlyAbledType());
        entity.setAddress(dto.getAddress());
        entity.setAddressLine1(dto.getAddressLine1());
        entity.setAddressLine2(dto.getAddressLine2());
        entity.setCity(dto.getCity());
        entity.setState(dto.getState());
        entity.setPinCode(dto.getPinCode());
        entity.setEmergencyContact(dto.getEmergencyContact());
        entity.setEmergencyContactName(dto.getEmergencyContactName());

        // Payment Information
        entity.setBankName(dto.getBankName());
        entity.setAccountNumber(dto.getAccountNumber());
        entity.setIfscCode(dto.getIfscCode());
        entity.setPaymentMethod(dto.getPaymentMethod());
        entity.setPanNumber(dto.getPanNumber());
        entity.setAadharNumber(dto.getAadharNumber());
    }

    private EmployeeResponseDTO mapEntityToDTO(Employee entity) {
        EmployeeResponseDTO dto = new EmployeeResponseDTO();

        dto.setId(entity.getId());

        // Basic Details
        dto.setFirstName(entity.getFirstName());
        dto.setMiddleName(entity.getMiddleName());
        dto.setLastName(entity.getLastName());
        dto.setFullName(entity.getFullName());
        dto.setEmployeeId(entity.getEmployeeId());
        dto.setDateOfJoining(entity.getDateOfJoining());
        dto.setWorkEmail(entity.getWorkEmail());
        dto.setMobileNumber(entity.getMobileNumber());
        dto.setIsDirector(entity.getIsDirector());
        dto.setGender(entity.getGender());
        dto.setWorkLocation(entity.getWorkLocation());
        dto.setDesignation(entity.getDesignation());
        dto.setDepartment(entity.getDepartment());
        dto.setEnablePortalAccess(entity.getEnablePortalAccess());
        dto.setProfessionalTax(entity.getProfessionalTax());

        // Salary Details
        dto.setAnnualCtc(entity.getAnnualCtc());
        dto.setBasicPercentOfCtc(entity.getBasicPercentOfCtc());
        dto.setHraPercentOfBasic(entity.getHraPercentOfBasic());
        dto.setConveyanceAllowanceMonthly(entity.getConveyanceAllowanceMonthly());
        dto.setBasicMonthly(entity.getBasicMonthly());
        dto.setHraMonthly(entity.getHraMonthly());
        dto.setFixedAllowanceMonthly(entity.getFixedAllowanceMonthly());

        // Personal Details
        dto.setDateOfBirth(entity.getDateOfBirth());
        dto.setAge(entity.getAge());
        dto.setFatherName(entity.getFatherName());
        dto.setPersonalEmail(entity.getPersonalEmail());
        dto.setDifferentlyAbledType(entity.getDifferentlyAbledType());
        dto.setAddress(entity.getAddress());
        dto.setAddressLine1(entity.getAddressLine1());
        dto.setAddressLine2(entity.getAddressLine2());
        dto.setCity(entity.getCity());
        dto.setState(entity.getState());
        dto.setPinCode(entity.getPinCode());
        dto.setEmergencyContact(entity.getEmergencyContact());
        dto.setEmergencyContactName(entity.getEmergencyContactName());

        // Payment Information
        dto.setBankName(entity.getBankName());
        dto.setAccountNumber(entity.getAccountNumber());
        dto.setIfscCode(entity.getIfscCode());
        dto.setPaymentMethod(entity.getPaymentMethod());
        dto.setPanNumber(entity.getPanNumber());
        dto.setAadharNumber(entity.getAadharNumber());

        // Status and Metadata
        dto.setStatus(entity.getStatus());
        dto.setOrganizationId(entity.getOrganization().getId());
        dto.setOrganizationName(entity.getOrganization().getCompanyName());
        dto.setCreatedByUserId(entity.getCreatedBy().getId());
        dto.setCreatedByUserEmail(entity.getCreatedBy().getEmail());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());

        // Calculate Profile Completeness
        int completionPercentage = calculateProfileCompleteness(entity);
        dto.setProfileCompletionPercentage(completionPercentage);
        dto.setIsProfileComplete(completionPercentage == 100);

        // Determine onboarding status
        if (completionPercentage == 100) {
            dto.setOnboardingStatus("Complete");
        } else if (completionPercentage >= 50) {
            dto.setOnboardingStatus("Incomplete");
        } else {
            dto.setOnboardingStatus("Pending");
        }

        return dto;
    }

    private int calculateProfileCompleteness(Employee entity) {
        int totalFields = 12; // Total required fields across all steps
        int filledFields = 0;

        // Basic Details (Required fields - 8)
        if (entity.getFirstName() != null && !entity.getFirstName().isEmpty())
            filledFields++;
        if (entity.getLastName() != null && !entity.getLastName().isEmpty())
            filledFields++;
        if (entity.getEmployeeId() != null && !entity.getEmployeeId().isEmpty())
            filledFields++;
        if (entity.getDateOfJoining() != null)
            filledFields++;
        if (entity.getWorkEmail() != null && !entity.getWorkEmail().isEmpty())
            filledFields++;
        if (entity.getMobileNumber() != null && !entity.getMobileNumber().isEmpty())
            filledFields++;
        if (entity.getDesignation() != null && !entity.getDesignation().isEmpty())
            filledFields++;
        if (entity.getDepartment() != null && !entity.getDepartment().isEmpty())
            filledFields++;

        // Salary Details (Required field - 1)
        if (entity.getAnnualCtc() != null && entity.getAnnualCtc().compareTo(java.math.BigDecimal.ZERO) > 0)
            filledFields++;

        // Personal Details (Required fields - 2)
        if (entity.getDateOfBirth() != null)
            filledFields++;
        if (entity.getGender() != null && !entity.getGender().isEmpty())
            filledFields++;

        // Payment Information (Required field - 1)
        if (entity.getPaymentMethod() != null && !entity.getPaymentMethod().isEmpty())
            filledFields++;

        // Calculate percentage - return 100 only if all 12 required fields are filled
        return (int) ((filledFields * 100.0) / totalFields);
    }

    @Transactional
    public int capitalizeEmployeeData(Long organizationId) {
        List<Employee> employees = employeeRepository.findByOrganizationId(organizationId);
        int updatedCount = 0;

        for (Employee employee : employees) {
            boolean updated = false;

            // Capitalize firstName
            if (employee.getFirstName() != null && !employee.getFirstName().isEmpty()) {
                String capitalized = capitalizeWords(employee.getFirstName());
                if (!capitalized.equals(employee.getFirstName())) {
                    employee.setFirstName(capitalized);
                    updated = true;
                }
            }

            // Capitalize middleName
            if (employee.getMiddleName() != null && !employee.getMiddleName().isEmpty()) {
                String capitalized = capitalizeWords(employee.getMiddleName());
                if (!capitalized.equals(employee.getMiddleName())) {
                    employee.setMiddleName(capitalized);
                    updated = true;
                }
            }

            // Capitalize lastName
            if (employee.getLastName() != null && !employee.getLastName().isEmpty()) {
                String capitalized = capitalizeWords(employee.getLastName());
                if (!capitalized.equals(employee.getLastName())) {
                    employee.setLastName(capitalized);
                    updated = true;
                }
            }

            // Capitalize designation
            if (employee.getDesignation() != null && !employee.getDesignation().isEmpty()) {
                String capitalized = capitalizeWords(employee.getDesignation());
                if (!capitalized.equals(employee.getDesignation())) {
                    employee.setDesignation(capitalized);
                    updated = true;
                }
            }

            // Capitalize department
            if (employee.getDepartment() != null && !employee.getDepartment().isEmpty()) {
                String capitalized = capitalizeWords(employee.getDepartment());
                if (!capitalized.equals(employee.getDepartment())) {
                    employee.setDepartment(capitalized);
                    updated = true;
                }
            }

            // Capitalize city
            if (employee.getCity() != null && !employee.getCity().isEmpty()) {
                String capitalized = capitalizeWords(employee.getCity());
                if (!capitalized.equals(employee.getCity())) {
                    employee.setCity(capitalized);
                    updated = true;
                }
            }

            // Capitalize fatherName
            if (employee.getFatherName() != null && !employee.getFatherName().isEmpty()) {
                String capitalized = capitalizeWords(employee.getFatherName());
                if (!capitalized.equals(employee.getFatherName())) {
                    employee.setFatherName(capitalized);
                    updated = true;
                }
            }

            // Capitalize bankName
            if (employee.getBankName() != null && !employee.getBankName().isEmpty()) {
                String capitalized = capitalizeWords(employee.getBankName());
                if (!capitalized.equals(employee.getBankName())) {
                    employee.setBankName(capitalized);
                    updated = true;
                }
            }

            // Capitalize emergencyContactName
            if (employee.getEmergencyContactName() != null && !employee.getEmergencyContactName().isEmpty()) {
                String capitalized = capitalizeWords(employee.getEmergencyContactName());
                if (!capitalized.equals(employee.getEmergencyContactName())) {
                    employee.setEmergencyContactName(capitalized);
                    updated = true;
                }
            }

            if (updated) {
                employeeRepository.save(employee);
                updatedCount++;
            }
        }

        return updatedCount;
    }

    private String capitalizeWords(String str) {
        if (str == null || str.isEmpty()) {
            return str;
        }
        
        String[] words = str.split(" ");
        StringBuilder result = new StringBuilder();
        
        for (int i = 0; i < words.length; i++) {
            if (words[i].length() > 0) {
                result.append(Character.toUpperCase(words[i].charAt(0)));
                if (words[i].length() > 1) {
                    result.append(words[i].substring(1).toLowerCase());
                }
            }
            if (i < words.length - 1) {
                result.append(" ");
            }
        }
        
        return result.toString();
    }

    @Transactional
    public EmployeeResponseDTO updateEmployeeStatus(Long id, String status) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        
        // Validate status
        if (!status.equals("Active") && !status.equals("Inactive") && !status.equals("Exited")) {
            throw new RuntimeException("Invalid status. Must be Active, Inactive, or Exited");
        }
        
        employee.setStatus(status);
        Employee updatedEmployee = employeeRepository.save(employee);
        
        return mapEntityToDTO(updatedEmployee);
    }

    // ============== EMPLOYEE EXIT METHODS ==============

    @Transactional
    public EmployeeResponseDTO initiateExit(Long employeeId, EmployeeExitDTO exitDTO, Long initiatedByUserId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        if ("Exited".equals(employee.getStatus())) {
            throw new RuntimeException("Employee has already exited");
        }

        // Set exit details
        employee.setExitReason(exitDTO.getExitReason());
        employee.setLastWorkingDay(exitDTO.getLastWorkingDay());
        employee.setExitNotes(exitDTO.getExitNotes());
        employee.setNoticePeriodDays(exitDTO.getNoticePeriodDays() != null ? exitDTO.getNoticePeriodDays() : 30);
        employee.setIsNoticePeriodServed(exitDTO.getIsNoticePeriodServed() != null ? exitDTO.getIsNoticePeriodServed() : false);
        employee.setRehireEligible(exitDTO.getRehireEligible() != null ? exitDTO.getRehireEligible() : true);
        employee.setExitInterviewDone(exitDTO.getExitInterviewDone() != null ? exitDTO.getExitInterviewDone() : false);
        employee.setExitInitiatedAt(LocalDateTime.now());
        employee.setExitInitiatedBy(initiatedByUserId);
        employee.setStatus("Notice Period");
        employee.setFinalSettlementStatus("PENDING");

        Employee savedEmployee = employeeRepository.save(employee);
        return mapEntityToDTO(savedEmployee);
    }

    @Transactional
    public FinalSettlementDTO calculateFinalSettlement(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        if (employee.getLastWorkingDay() == null) {
            throw new RuntimeException("Last working day not set. Please initiate exit first.");
        }

        // Check if settlement already exists
        EmployeeFinalSettlement settlement = finalSettlementRepository.findByEmployeeId(employeeId)
                .orElse(new EmployeeFinalSettlement());

        settlement.setEmployee(employee);
        settlement.setOrganization(employee.getOrganization());
        settlement.setLastWorkingDay(employee.getLastWorkingDay());

        // Calculate prorated salary for the month
        LocalDate lwd = employee.getLastWorkingDay();
        int totalDaysInMonth = lwd.lengthOfMonth();
        int workedDays = lwd.getDayOfMonth();
        
        BigDecimal monthlyCtc = employee.getAnnualCtc() != null 
                ? employee.getAnnualCtc().divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;
        BigDecimal dailyRate = monthlyCtc.divide(BigDecimal.valueOf(totalDaysInMonth), 2, RoundingMode.HALF_UP);
        BigDecimal proratedSalary = dailyRate.multiply(BigDecimal.valueOf(workedDays));

        settlement.setWorkedDays(workedDays);
        settlement.setTotalDaysInMonth(totalDaysInMonth);
        settlement.setProratedSalary(proratedSalary);

        // Calculate years of service for gratuity
        LocalDate doj = employee.getDateOfJoining();
        long yearsOfService = ChronoUnit.YEARS.between(doj, lwd);
        BigDecimal yearsDecimal = BigDecimal.valueOf(ChronoUnit.DAYS.between(doj, lwd))
                .divide(BigDecimal.valueOf(365), 2, RoundingMode.HALF_UP);
        
        settlement.setYearsOfService(yearsDecimal);
        settlement.setIsGratuityEligible(yearsOfService >= 5);

        // Calculate gratuity if eligible (5+ years)
        // Gratuity = (Last drawn salary × 15 × Years of service) / 26
        if (settlement.getIsGratuityEligible()) {
            BigDecimal basicMonthly = employee.getBasicMonthly() != null ? employee.getBasicMonthly() : monthlyCtc.multiply(BigDecimal.valueOf(0.5));
            BigDecimal gratuity = basicMonthly.multiply(BigDecimal.valueOf(15))
                    .multiply(yearsDecimal)
                    .divide(BigDecimal.valueOf(26), 2, RoundingMode.HALF_UP);
            settlement.setGratuityAmount(gratuity);
        }

        // Notice period calculation
        int noticePeriodDays = employee.getNoticePeriodDays() != null ? employee.getNoticePeriodDays() : 30;
        settlement.setNoticePeriodDays(noticePeriodDays);
        
        if (Boolean.TRUE.equals(employee.getIsNoticePeriodServed())) {
            settlement.setNoticePeriodServedDays(noticePeriodDays);
            settlement.setNoticePayRecovery(BigDecimal.ZERO);
        } else {
            // Calculate notice pay recovery
            long daysBetween = ChronoUnit.DAYS.between(employee.getExitInitiatedAt().toLocalDate(), lwd);
            int servedDays = (int) Math.max(0, daysBetween);
            settlement.setNoticePeriodServedDays(servedDays);
            
            int shortfallDays = noticePeriodDays - servedDays;
            if (shortfallDays > 0) {
                BigDecimal noticePayRecovery = dailyRate.multiply(BigDecimal.valueOf(shortfallDays));
                settlement.setNoticePayRecovery(noticePayRecovery);
            }
        }

        // Leave encashment (placeholder - would need leave balance data)
        settlement.setLeaveBalanceDays(BigDecimal.ZERO);
        settlement.setLeaveEncashmentAmount(BigDecimal.ZERO);

        // Calculate totals
        settlement.calculateTotals();
        settlement.setStatus("DRAFT");

        EmployeeFinalSettlement saved = finalSettlementRepository.save(settlement);
        return mapSettlementToDTO(saved);
    }

    @Transactional
    public FinalSettlementDTO approveFinalSettlement(Long settlementId, Long approvedByUserId) {
        EmployeeFinalSettlement settlement = finalSettlementRepository.findById(settlementId)
                .orElseThrow(() -> new RuntimeException("Settlement not found"));

        settlement.setStatus("APPROVED");
        settlement.setApprovedBy(approvedByUserId);
        settlement.setApprovedAt(LocalDateTime.now());

        // Update employee status
        Employee employee = settlement.getEmployee();
        employee.setFinalSettlementStatus("APPROVED");
        employeeRepository.save(employee);

        EmployeeFinalSettlement saved = finalSettlementRepository.save(settlement);
        return mapSettlementToDTO(saved);
    }

    @Transactional
    public FinalSettlementDTO markSettlementPaid(Long settlementId, String paymentReference) {
        EmployeeFinalSettlement settlement = finalSettlementRepository.findById(settlementId)
                .orElseThrow(() -> new RuntimeException("Settlement not found"));

        if (!"APPROVED".equals(settlement.getStatus())) {
            throw new RuntimeException("Settlement must be approved before marking as paid");
        }

        settlement.setStatus("PAID");
        settlement.setPaidAt(LocalDateTime.now());
        settlement.setPaymentReference(paymentReference);
        settlement.setSettlementDate(LocalDate.now());

        // Update employee status to Exited
        Employee employee = settlement.getEmployee();
        employee.setStatus("Exited");
        employee.setExitDate(LocalDate.now());
        employee.setFinalSettlementStatus("COMPLETED");
        employeeRepository.save(employee);

        EmployeeFinalSettlement saved = finalSettlementRepository.save(settlement);
        return mapSettlementToDTO(saved);
    }

    @Transactional(readOnly = true)
    public FinalSettlementDTO getFinalSettlement(Long employeeId) {
        EmployeeFinalSettlement settlement = finalSettlementRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new RuntimeException("No settlement found for this employee"));
        return mapSettlementToDTO(settlement);
    }

    @Transactional(readOnly = true)
    public List<FinalSettlementDTO> getAllSettlementsByOrganization(Long organizationId) {
        return finalSettlementRepository.findByOrganizationId(organizationId)
                .stream()
                .map(this::mapSettlementToDTO)
                .collect(Collectors.toList());
    }

    private FinalSettlementDTO mapSettlementToDTO(EmployeeFinalSettlement entity) {
        FinalSettlementDTO dto = new FinalSettlementDTO();
        dto.setId(entity.getId());
        dto.setEmployeeId(entity.getEmployee().getId());
        dto.setEmployeeName(entity.getEmployee().getFullName());
        dto.setEmployeeCode(entity.getEmployee().getEmployeeId());
        dto.setOrganizationId(entity.getOrganization().getId());
        dto.setSettlementDate(entity.getSettlementDate());
        dto.setLastWorkingDay(entity.getLastWorkingDay());
        dto.setPendingSalary(entity.getPendingSalary());
        dto.setProratedSalary(entity.getProratedSalary());
        dto.setWorkedDays(entity.getWorkedDays());
        dto.setTotalDaysInMonth(entity.getTotalDaysInMonth());
        dto.setLeaveBalanceDays(entity.getLeaveBalanceDays());
        dto.setLeaveEncashmentAmount(entity.getLeaveEncashmentAmount());
        dto.setIsGratuityEligible(entity.getIsGratuityEligible());
        dto.setYearsOfService(entity.getYearsOfService());
        dto.setGratuityAmount(entity.getGratuityAmount());
        dto.setNoticePeriodDays(entity.getNoticePeriodDays());
        dto.setNoticePeriodServedDays(entity.getNoticePeriodServedDays());
        dto.setNoticePayRecovery(entity.getNoticePayRecovery());
        dto.setNoticePayPayable(entity.getNoticePayPayable());
        dto.setBonusPayable(entity.getBonusPayable());
        dto.setOtherEarnings(entity.getOtherEarnings());
        dto.setPendingLoans(entity.getPendingLoans());
        dto.setOtherDeductions(entity.getOtherDeductions());
        dto.setTdsOnSettlement(entity.getTdsOnSettlement());
        dto.setTotalEarnings(entity.getTotalEarnings());
        dto.setTotalDeductions(entity.getTotalDeductions());
        dto.setNetSettlementAmount(entity.getNetSettlementAmount());
        dto.setStatus(entity.getStatus());
        dto.setNotes(entity.getNotes());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setApprovedAt(entity.getApprovedAt());
        dto.setPaidAt(entity.getPaidAt());
        dto.setPaymentReference(entity.getPaymentReference());
        return dto;
    }
}
