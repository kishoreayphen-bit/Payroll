package com.payroll.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PayRunDTO {

    private Long id;
    private String payRunNumber;
    private Long tenantId;
    private LocalDate payPeriodStart;
    private LocalDate payPeriodEnd;
    private LocalDate payDate;
    private String status;
    private BigDecimal totalGrossPay;
    private BigDecimal totalDeductions;
    private BigDecimal totalNetPay;
    private BigDecimal totalEmployerContributions;
    private Integer employeeCount;
    private String notes;
    private Long processedBy;
    private LocalDateTime processedAt;
    private Long approvedBy;
    private LocalDateTime approvedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<PayRunEmployeeDTO> employees;

    // Request DTO for creating a pay run
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreatePayRunRequest {
        private LocalDate payPeriodStart;
        private LocalDate payPeriodEnd;
        private LocalDate payDate;
        private String notes;
        private List<Long> employeeIds; // Optional: specific employees, null means all active
    }

    // Request DTO for updating pay run status
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateStatusRequest {
        private String status;
        private String notes;
    }
}
