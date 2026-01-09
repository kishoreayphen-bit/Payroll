package com.payroll.entity;

import com.payroll.organization.Organization;
import com.payroll.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "employees", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "employee_id", "organization_id" }),
        @UniqueConstraint(columnNames = { "work_email", "organization_id" })
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Basic Details
    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "middle_name", length = 100)
    private String middleName;

    @Column(name = "last_name", length = 100)
    private String lastName;

    @Column(name = "employee_id", nullable = false, length = 50)
    private String employeeId;

    @Column(name = "date_of_joining", nullable = false)
    private LocalDate dateOfJoining;

    @Column(name = "work_email", nullable = false)
    private String workEmail;

    @Column(name = "mobile_number", nullable = false, length = 20)
    private String mobileNumber;

    @Column(name = "is_director")
    private Boolean isDirector = false;

    @Column(name = "gender", length = 20)
    private String gender;

    @Column(name = "work_location")
    private String workLocation;

    @Column(name = "designation", length = 100)
    private String designation;

    @Column(name = "department", length = 100)
    private String department;

    @Column(name = "enable_portal_access")
    private Boolean enablePortalAccess = false;

    @Column(name = "professional_tax")
    private Boolean professionalTax = true;

    // Salary Details
    @Column(name = "annual_ctc", precision = 15, scale = 2)
    private BigDecimal annualCtc;

    @Column(name = "basic_percent_of_ctc", precision = 5, scale = 2)
    private BigDecimal basicPercentOfCtc = new BigDecimal("50.00");

    @Column(name = "hra_percent_of_basic", precision = 5, scale = 2)
    private BigDecimal hraPercentOfBasic = new BigDecimal("50.00");

    @Column(name = "conveyance_allowance_monthly", precision = 15, scale = 2)
    private BigDecimal conveyanceAllowanceMonthly;

    @Column(name = "basic_monthly", precision = 15, scale = 2)
    private BigDecimal basicMonthly;

    @Column(name = "hra_monthly", precision = 15, scale = 2)
    private BigDecimal hraMonthly;

    @Column(name = "fixed_allowance_monthly", precision = 15, scale = 2)
    private BigDecimal fixedAllowanceMonthly;

    // Personal Details
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "age")
    private Integer age;

    @Column(name = "father_name")
    private String fatherName;

    @Column(name = "personal_email")
    private String personalEmail;

    @Column(name = "differently_abled_type", length = 50)
    private String differentlyAbledType = "none";

    // Address
    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "address_line1")
    private String addressLine1;

    @Column(name = "address_line2")
    private String addressLine2;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "state", length = 100)
    private String state;

    @Column(name = "pin_code", length = 10)
    private String pinCode;

    // Emergency Contact
    @Column(name = "emergency_contact", length = 20)
    private String emergencyContact;

    @Column(name = "emergency_contact_name")
    private String emergencyContactName;

    // Payment Information
    @Column(name = "bank_name")
    private String bankName;

    @Column(name = "account_number", length = 50)
    private String accountNumber;

    @Column(name = "ifsc_code", length = 20)
    private String ifscCode;

    @Column(name = "payment_method", length = 50)
    private String paymentMethod = "bank_transfer";

    @Column(name = "pan_number", length = 20)
    private String panNumber;

    @Column(name = "aadhar_number", length = 20)
    private String aadharNumber;

    // Statutory Information
    @Column(name = "uan", length = 20)
    private String uan;

    @Column(name = "pf_number", length = 30)
    private String pfNumber;

    @Column(name = "esi_number", length = 20)
    private String esiNumber;

    // Status and Metadata
    @Column(name = "status", length = 20)
    private String status = "Active";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_user_id", nullable = false)
    private User createdBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.updatedAt == null) {
            this.updatedAt = LocalDateTime.now();
        }
    }

    // Helper method to get full name
    public String getFullName() {
        StringBuilder fullName = new StringBuilder(firstName != null ? firstName : "");
        if (middleName != null && !middleName.isEmpty()) {
            if (fullName.length() > 0)
                fullName.append(" ");
            fullName.append(middleName);
        }
        if (lastName != null && !lastName.isEmpty()) {
            if (fullName.length() > 0)
                fullName.append(" ");
            fullName.append(lastName);
        }
        return fullName.toString().trim();
    }
}
