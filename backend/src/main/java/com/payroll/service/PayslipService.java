package com.payroll.service;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.payroll.dto.PayslipDTO;
import com.payroll.entity.*;
import com.payroll.organization.Organization;
import com.payroll.organization.OrganizationRepository;
import com.payroll.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PayslipService {

    private final PayslipRepository payslipRepository;
    private final PayRunRepository payRunRepository;
    private final PayRunEmployeeRepository payRunEmployeeRepository;
    private final OrganizationRepository organizationRepository;
    private final JavaMailSender mailSender;

    @Value("${payslip.storage.path:./payslips}")
    private String payslipStoragePath;

    @Value("${spring.mail.username:noreply@payroll.com}")
    private String fromEmail;

    private static final DeviceRgb PRIMARY_COLOR = new DeviceRgb(236, 72, 153); // Pink-500
    private static final DeviceRgb HEADER_BG = new DeviceRgb(248, 250, 252); // Slate-50

    @Transactional
    public List<PayslipDTO> generatePayslips(Long payRunId, Long tenantId) {
        log.info("Generating payslips for pay run: {}", payRunId);

        PayRun payRun = payRunRepository.findByIdAndTenantId(payRunId, tenantId)
                .orElseThrow(() -> new RuntimeException("Pay run not found"));

        if (payRun.getStatus() != PayRun.PayRunStatus.APPROVED && 
            payRun.getStatus() != PayRun.PayRunStatus.COMPLETED) {
            throw new RuntimeException("Pay run must be APPROVED or COMPLETED to generate payslips");
        }

        Organization organization = organizationRepository.findById(tenantId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        List<PayRunEmployee> employees = payRunEmployeeRepository.findByPayRunId(payRunId);
        
        return employees.stream()
                .map(pre -> generatePayslip(pre, payRun, organization))
                .collect(Collectors.toList());
    }

    @Transactional
    public PayslipDTO generatePayslip(PayRunEmployee payRunEmployee, PayRun payRun, Organization organization) {
        // Check if payslip already exists
        Payslip existingPayslip = payslipRepository.findByPayRunEmployeeId(payRunEmployee.getId()).orElse(null);
        
        Payslip payslip;
        if (existingPayslip != null) {
            payslip = existingPayslip;
        } else {
            payslip = new Payslip();
            payslip.setPayRunEmployee(payRunEmployee);
            payslip.setEmployee(payRunEmployee.getEmployee());
            payslip.setTenantId(payRun.getTenantId());
        }

        // Copy data from pay run employee
        payslip.setPayPeriodStart(payRun.getPayPeriodStart());
        payslip.setPayPeriodEnd(payRun.getPayPeriodEnd());
        payslip.setPayDate(payRun.getPayDate());
        payslip.setBasicSalary(payRunEmployee.getBasicSalary());
        payslip.setHra(payRunEmployee.getHra());
        payslip.setConveyanceAllowance(payRunEmployee.getConveyanceAllowance());
        payslip.setFixedAllowance(payRunEmployee.getFixedAllowance());
        payslip.setOtherEarnings(payRunEmployee.getOtherEarnings());
        payslip.setGrossSalary(payRunEmployee.getGrossSalary());
        payslip.setPfEmployee(payRunEmployee.getPfEmployee());
        payslip.setEsiEmployee(payRunEmployee.getEsiEmployee());
        payslip.setProfessionalTax(payRunEmployee.getProfessionalTax());
        payslip.setTds(payRunEmployee.getTds());
        payslip.setLopDeduction(payRunEmployee.getLopDeduction());
        payslip.setOtherDeductions(payRunEmployee.getOtherDeductions());
        payslip.setTotalDeductions(payRunEmployee.getTotalDeductions());
        payslip.setNetSalary(payRunEmployee.getNetSalary());
        payslip.setWorkingDays(payRunEmployee.getWorkingDays());
        payslip.setDaysWorked(payRunEmployee.getDaysWorked());
        payslip.setLopDays(payRunEmployee.getLopDays());

        payslip = payslipRepository.save(payslip);

        // Generate PDF
        try {
            String pdfPath = generatePdf(payslip, organization);
            payslip.setPdfPath(pdfPath);
            payslip.setPdfGeneratedAt(LocalDateTime.now());
            payslip.setStatus(Payslip.PayslipStatus.GENERATED);
            payslip = payslipRepository.save(payslip);

            // Update pay run employee
            payRunEmployee.setPayslipGenerated(true);
            payRunEmployeeRepository.save(payRunEmployee);

        } catch (Exception e) {
            log.error("Failed to generate PDF for payslip: {}", payslip.getId(), e);
            throw new RuntimeException("Failed to generate PDF: " + e.getMessage());
        }

        return convertToDTO(payslip, organization);
    }

    public String generatePdf(Payslip payslip, Organization organization) throws IOException {
        Employee employee = payslip.getEmployee();
        
        // Create directory if not exists
        File dir = new File(payslipStoragePath);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String fileName = String.format("payslip_%s_%s_%s.pdf",
                employee.getEmployeeId(),
                payslip.getPayPeriodStart().format(DateTimeFormatter.ofPattern("yyyyMM")),
                System.currentTimeMillis());
        String filePath = payslipStoragePath + File.separator + fileName;

        try (FileOutputStream fos = new FileOutputStream(filePath);
             PdfWriter writer = new PdfWriter(fos);
             PdfDocument pdf = new PdfDocument(writer);
             Document document = new Document(pdf, PageSize.A4)) {

            document.setMargins(30, 30, 30, 30);

            // Header with company name
            Paragraph header = new Paragraph(organization.getCompanyName())
                    .setFontSize(20)
                    .setBold()
                    .setFontColor(PRIMARY_COLOR)
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(header);

            // Company address
            String companyAddress = buildAddress(organization);
            if (companyAddress != null && !companyAddress.isEmpty()) {
                document.add(new Paragraph(companyAddress)
                        .setFontSize(10)
                        .setTextAlignment(TextAlignment.CENTER)
                        .setFontColor(ColorConstants.GRAY));
            }

            document.add(new Paragraph("\n"));

            // Payslip title
            document.add(new Paragraph("PAYSLIP")
                    .setFontSize(16)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER)
                    .setBackgroundColor(HEADER_BG)
                    .setPadding(10));

            // Pay period
            String period = String.format("Pay Period: %s to %s",
                    payslip.getPayPeriodStart().format(DateTimeFormatter.ofPattern("dd MMM yyyy")),
                    payslip.getPayPeriodEnd().format(DateTimeFormatter.ofPattern("dd MMM yyyy")));
            document.add(new Paragraph(period)
                    .setFontSize(11)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20));

            // Employee details table
            Table empTable = new Table(UnitValue.createPercentArray(new float[]{1, 2, 1, 2}))
                    .useAllAvailableWidth()
                    .setMarginBottom(20);

            addEmployeeDetailCell(empTable, "Employee Name", employee.getFirstName() + " " + employee.getLastName());
            addEmployeeDetailCell(empTable, "Employee ID", employee.getEmployeeId());
            addEmployeeDetailCell(empTable, "Designation", employee.getDesignation());
            addEmployeeDetailCell(empTable, "Department", employee.getDepartment());
            addEmployeeDetailCell(empTable, "PAN", employee.getPanNumber() != null ? employee.getPanNumber() : "-");
            addEmployeeDetailCell(empTable, "Bank Account", maskAccountNumber(employee.getAccountNumber()));
            addEmployeeDetailCell(empTable, "Working Days", String.valueOf(payslip.getWorkingDays()));
            addEmployeeDetailCell(empTable, "Days Worked", String.valueOf(payslip.getDaysWorked()));

            document.add(empTable);

            // Earnings and Deductions
            Table salaryTable = new Table(UnitValue.createPercentArray(new float[]{3, 2, 3, 2}))
                    .useAllAvailableWidth()
                    .setMarginTop(10);

            // Headers
            salaryTable.addHeaderCell(createHeaderCell("EARNINGS"));
            salaryTable.addHeaderCell(createHeaderCell("AMOUNT (₹)"));
            salaryTable.addHeaderCell(createHeaderCell("DEDUCTIONS"));
            salaryTable.addHeaderCell(createHeaderCell("AMOUNT (₹)"));

            // Data rows
            addSalaryRow(salaryTable, "Basic Salary", payslip.getBasicSalary(), "Provident Fund", payslip.getPfEmployee());
            addSalaryRow(salaryTable, "House Rent Allowance", payslip.getHra(), "ESI", payslip.getEsiEmployee());
            addSalaryRow(salaryTable, "Conveyance Allowance", payslip.getConveyanceAllowance(), "Professional Tax", payslip.getProfessionalTax());
            addSalaryRow(salaryTable, "Fixed Allowance", payslip.getFixedAllowance(), "TDS", payslip.getTds());
            addSalaryRow(salaryTable, "Other Earnings", payslip.getOtherEarnings(), "LOP Deduction", payslip.getLopDeduction());
            addSalaryRow(salaryTable, "", null, "Other Deductions", payslip.getOtherDeductions());

            // Totals
            salaryTable.addCell(createTotalCell("GROSS EARNINGS"));
            salaryTable.addCell(createTotalCell(formatAmount(payslip.getGrossSalary())));
            salaryTable.addCell(createTotalCell("TOTAL DEDUCTIONS"));
            salaryTable.addCell(createTotalCell(formatAmount(payslip.getTotalDeductions())));

            document.add(salaryTable);

            // Net Pay
            document.add(new Paragraph("\n"));
            Table netPayTable = new Table(UnitValue.createPercentArray(new float[]{3, 1}))
                    .useAllAvailableWidth();
            
            Cell netPayLabelCell = new Cell()
                    .add(new Paragraph("NET PAY").setBold().setFontSize(14))
                    .setBackgroundColor(PRIMARY_COLOR)
                    .setFontColor(ColorConstants.WHITE)
                    .setPadding(10)
                    .setBorder(Border.NO_BORDER);
            
            Cell netPayValueCell = new Cell()
                    .add(new Paragraph("₹ " + formatAmount(payslip.getNetSalary())).setBold().setFontSize(14))
                    .setBackgroundColor(PRIMARY_COLOR)
                    .setFontColor(ColorConstants.WHITE)
                    .setPadding(10)
                    .setTextAlignment(TextAlignment.RIGHT)
                    .setBorder(Border.NO_BORDER);

            netPayTable.addCell(netPayLabelCell);
            netPayTable.addCell(netPayValueCell);
            document.add(netPayTable);

            // Footer - removed as per user request
        }

        return filePath;
    }

    private void addEmployeeDetailCell(Table table, String label, String value) {
        table.addCell(new Cell()
                .add(new Paragraph(label).setFontSize(9).setFontColor(ColorConstants.GRAY))
                .setBorder(Border.NO_BORDER)
                .setPadding(5));
        table.addCell(new Cell()
                .add(new Paragraph(value != null ? value : "-").setFontSize(10).setBold())
                .setBorder(Border.NO_BORDER)
                .setPadding(5));
    }

    private Cell createHeaderCell(String text) {
        return new Cell()
                .add(new Paragraph(text).setBold().setFontSize(10))
                .setBackgroundColor(HEADER_BG)
                .setPadding(8)
                .setTextAlignment(TextAlignment.CENTER);
    }

    private void addSalaryRow(Table table, String earning, BigDecimal earningAmt, String deduction, BigDecimal deductionAmt) {
        table.addCell(new Cell().add(new Paragraph(earning).setFontSize(10)).setPadding(8)
                .setBorderTop(new SolidBorder(ColorConstants.LIGHT_GRAY, 0.5f))
                .setBorderBottom(Border.NO_BORDER)
                .setBorderLeft(Border.NO_BORDER)
                .setBorderRight(Border.NO_BORDER));
        table.addCell(new Cell().add(new Paragraph(earningAmt != null ? formatAmount(earningAmt) : "").setFontSize(10))
                .setPadding(8).setTextAlignment(TextAlignment.RIGHT)
                .setBorderTop(new SolidBorder(ColorConstants.LIGHT_GRAY, 0.5f))
                .setBorderBottom(Border.NO_BORDER)
                .setBorderLeft(Border.NO_BORDER)
                .setBorderRight(Border.NO_BORDER));
        table.addCell(new Cell().add(new Paragraph(deduction).setFontSize(10)).setPadding(8)
                .setBorderTop(new SolidBorder(ColorConstants.LIGHT_GRAY, 0.5f))
                .setBorderBottom(Border.NO_BORDER)
                .setBorderLeft(Border.NO_BORDER)
                .setBorderRight(Border.NO_BORDER));
        table.addCell(new Cell().add(new Paragraph(deductionAmt != null ? formatAmount(deductionAmt) : "").setFontSize(10))
                .setPadding(8).setTextAlignment(TextAlignment.RIGHT)
                .setBorderTop(new SolidBorder(ColorConstants.LIGHT_GRAY, 0.5f))
                .setBorderBottom(Border.NO_BORDER)
                .setBorderLeft(Border.NO_BORDER)
                .setBorderRight(Border.NO_BORDER));
    }

    private Cell createTotalCell(String text) {
        return new Cell()
                .add(new Paragraph(text).setBold().setFontSize(10))
                .setBackgroundColor(HEADER_BG)
                .setPadding(8)
                .setTextAlignment(TextAlignment.RIGHT);
    }

    private String formatAmount(BigDecimal amount) {
        if (amount == null) return "0.00";
        return String.format("%,.2f", amount);
    }

    private String maskAccountNumber(String accountNumber) {
        if (accountNumber == null || accountNumber.length() < 4) return "-";
        return "XXXX" + accountNumber.substring(accountNumber.length() - 4);
    }

    public byte[] getPayslipPdf(Long payslipId, Long employeeId) {
        Payslip payslip = payslipRepository.findByIdAndEmployeeId(payslipId, employeeId)
                .orElseThrow(() -> new RuntimeException("Payslip not found"));

        if (payslip.getPdfPath() == null) {
            throw new RuntimeException("PDF not generated for this payslip");
        }

        try {
            return java.nio.file.Files.readAllBytes(java.nio.file.Paths.get(payslip.getPdfPath()));
        } catch (IOException e) {
            throw new RuntimeException("Failed to read payslip PDF: " + e.getMessage());
        }
    }

    @Transactional
    public void sendPayslipEmail(Long payslipId, Long tenantId) {
        Payslip payslip = payslipRepository.findById(payslipId)
                .orElseThrow(() -> new RuntimeException("Payslip not found"));

        Employee employee = payslip.getEmployee();
        String recipientEmail = employee.getPersonalEmail() != null ? employee.getPersonalEmail() : employee.getWorkEmail();

        if (recipientEmail == null) {
            throw new RuntimeException("No email address found for employee");
        }

        Organization organization = organizationRepository.findById(tenantId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(fromEmail);
            helper.setTo(recipientEmail);
            helper.setSubject(String.format("Payslip for %s %s - %s",
                    payslip.getPayPeriodStart().format(DateTimeFormatter.ofPattern("MMM")),
                    payslip.getPayPeriodStart().getYear(),
                    organization.getCompanyName()));

            String body = String.format("""
                    Dear %s,
                    
                    Please find attached your payslip for the period %s to %s.
                    
                    Summary:
                    - Gross Salary: ₹%s
                    - Total Deductions: ₹%s
                    - Net Pay: ₹%s
                    
                    You can also view your payslip in the employee portal.
                    
                    Best regards,
                    %s HR Team
                    """,
                    employee.getFirstName(),
                    payslip.getPayPeriodStart().format(DateTimeFormatter.ofPattern("dd MMM yyyy")),
                    payslip.getPayPeriodEnd().format(DateTimeFormatter.ofPattern("dd MMM yyyy")),
                    formatAmount(payslip.getGrossSalary()),
                    formatAmount(payslip.getTotalDeductions()),
                    formatAmount(payslip.getNetSalary()),
                    organization.getCompanyName());

            helper.setText(body);

            // Attach PDF
            if (payslip.getPdfPath() != null) {
                File pdfFile = new File(payslip.getPdfPath());
                if (pdfFile.exists()) {
                    helper.addAttachment("payslip.pdf", pdfFile);
                }
            }

            mailSender.send(message);

            // Update payslip status
            payslip.setEmailSent(true);
            payslip.setEmailSentAt(LocalDateTime.now());
            payslip.setStatus(Payslip.PayslipStatus.SENT);
            payslipRepository.save(payslip);

            log.info("Payslip email sent to: {}", recipientEmail);

        } catch (MessagingException e) {
            log.error("Failed to send payslip email: {}", e.getMessage());
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public List<PayslipDTO> getPayRunPayslips(Long payRunId, Long tenantId) {
        return payslipRepository.findByPayRunIdOrderByEmployeeIdAsc(payRunId)
                .stream()
                .map(p -> convertToDTO(p, null))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PayslipDTO> getEmployeePayslips(Long employeeId) {
        return payslipRepository.findByEmployeeIdOrderByPayPeriodEndDesc(employeeId)
                .stream()
                .map(p -> convertToDTO(p, null))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PayslipDTO> getEmployeePayslipsByYear(Long employeeId, int year) {
        return payslipRepository.findByEmployeeIdAndYear(employeeId, year)
                .stream()
                .map(p -> convertToDTO(p, null))
                .collect(Collectors.toList());
    }

    private PayslipDTO convertToDTO(Payslip entity, Organization organization) {
        PayslipDTO dto = new PayslipDTO();
        dto.setId(entity.getId());
        dto.setPayslipNumber(entity.getPayslipNumber());
        dto.setEmployeeId(entity.getEmployee().getId());
        dto.setEmployeeNumber(entity.getEmployee().getEmployeeId());
        dto.setEmployeeName(entity.getEmployee().getFirstName() + " " + entity.getEmployee().getLastName());
        dto.setDesignation(entity.getEmployee().getDesignation());
        dto.setDepartment(entity.getEmployee().getDepartment());
        dto.setPayPeriodStart(entity.getPayPeriodStart());
        dto.setPayPeriodEnd(entity.getPayPeriodEnd());
        dto.setPayDate(entity.getPayDate());
        dto.setBasicSalary(entity.getBasicSalary());
        dto.setHra(entity.getHra());
        dto.setConveyanceAllowance(entity.getConveyanceAllowance());
        dto.setFixedAllowance(entity.getFixedAllowance());
        dto.setOtherEarnings(entity.getOtherEarnings());
        dto.setGrossSalary(entity.getGrossSalary());
        dto.setPfEmployee(entity.getPfEmployee());
        dto.setEsiEmployee(entity.getEsiEmployee());
        dto.setProfessionalTax(entity.getProfessionalTax());
        dto.setTds(entity.getTds());
        dto.setLopDeduction(entity.getLopDeduction());
        dto.setOtherDeductions(entity.getOtherDeductions());
        dto.setTotalDeductions(entity.getTotalDeductions());
        dto.setNetSalary(entity.getNetSalary());
        dto.setWorkingDays(entity.getWorkingDays());
        dto.setDaysWorked(entity.getDaysWorked());
        dto.setLopDays(entity.getLopDays());
        dto.setPdfPath(entity.getPdfPath());
        dto.setPdfGeneratedAt(entity.getPdfGeneratedAt());
        dto.setEmailSent(entity.getEmailSent());
        dto.setEmailSentAt(entity.getEmailSentAt());
        dto.setStatus(entity.getStatus().name());
        dto.setCreatedAt(entity.getCreatedAt());

        if (organization != null) {
            dto.setCompanyName(organization.getCompanyName());
            dto.setCompanyAddress(buildAddress(organization));
        }

        return dto;
    }

    private String buildAddress(Organization organization) {
        StringBuilder sb = new StringBuilder();
        if (organization.getAddressLine1() != null) {
            sb.append(organization.getAddressLine1());
        }
        if (organization.getAddressLine2() != null && !organization.getAddressLine2().isEmpty()) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(organization.getAddressLine2());
        }
        if (organization.getCity() != null) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(organization.getCity());
        }
        if (organization.getState() != null) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(organization.getState());
        }
        if (organization.getPinCode() != null) {
            if (sb.length() > 0) sb.append(" - ");
            sb.append(organization.getPinCode());
        }
        return sb.toString();
    }
}
