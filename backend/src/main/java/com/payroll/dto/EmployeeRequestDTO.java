package com.payroll.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeRequestDTO {

    // Basic Details
    private String firstName;
    private String middleName;
    private String lastName;
    private String employeeId;
    private LocalDate dateOfJoining;
    private String workEmail;
    private String mobileNumber;
    private Boolean isDirector;
    private String gender;
    private String workLocation;
    private String designation;
    private String department;
    private Boolean enablePortalAccess;
    private Boolean professionalTax;

    // Salary Details
    private BigDecimal annualCtc;
    private BigDecimal basicPercentOfCtc;
    private BigDecimal hraPercentOfBasic;
    private BigDecimal conveyanceAllowanceMonthly;
    private BigDecimal basicMonthly;
    private BigDecimal hraMonthly;
    private BigDecimal fixedAllowanceMonthly;

    // Personal Details
    private LocalDate dateOfBirth;
    private Integer age;
    private String fatherName;
    private String personalEmail;
    private String differentlyAbledType;

    // Address
    private String address;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String pinCode;

    // Emergency Contact
    private String emergencyContact;
    private String emergencyContactName;

    // Payment Information
    private String bankName;
    private String accountNumber;
    private String ifscCode;
    private String paymentMethod;
    private String panNumber;
    private String aadharNumber;

    // Organization ID (required)
    private Long organizationId;
}
