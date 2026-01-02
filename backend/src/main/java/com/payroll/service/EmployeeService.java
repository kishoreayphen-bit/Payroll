package com.payroll.service;

import com.payroll.dto.EmployeeRequestDTO;
import com.payroll.dto.EmployeeResponseDTO;
import com.payroll.entity.Employee;
import com.payroll.organization.Organization;
import com.payroll.organization.OrganizationRepository;
import com.payroll.repository.EmployeeRepository;
import com.payroll.user.User;
import com.payroll.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        Employee savedEmployee = employeeRepository.save(employee);

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
        int totalFields = 0;
        int filledFields = 0;

        // Basic Details (Required fields - 8)
        totalFields += 8;
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

        // Salary Details (Important fields - 3)
        totalFields += 3;
        if (entity.getAnnualCtc() != null)
            filledFields++;
        if (entity.getBasicMonthly() != null)
            filledFields++;
        if (entity.getHraMonthly() != null)
            filledFields++;

        // Personal Details (Important fields - 4)
        totalFields += 4;
        if (entity.getDateOfBirth() != null)
            filledFields++;
        if (entity.getGender() != null && !entity.getGender().isEmpty())
            filledFields++;
        if (entity.getPersonalEmail() != null && !entity.getPersonalEmail().isEmpty())
            filledFields++;
        if (entity.getAddress() != null && !entity.getAddress().isEmpty())
            filledFields++;

        // Payment Information (Critical fields - 3)
        totalFields += 3;
        if (entity.getBankName() != null && !entity.getBankName().isEmpty())
            filledFields++;
        if (entity.getAccountNumber() != null && !entity.getAccountNumber().isEmpty())
            filledFields++;
        if (entity.getPanNumber() != null && !entity.getPanNumber().isEmpty())
            filledFields++;

        // Calculate percentage
        return (int) ((filledFields * 100.0) / totalFields);
    }
}
