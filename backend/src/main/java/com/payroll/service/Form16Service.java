package com.payroll.service;

import com.payroll.entity.*;
import com.payroll.repository.*;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class Form16Service {

    private final EmployeeRepository employeeRepository;
    private final PayRunRepository payRunRepository;
    private final PayRunEmployeeRepository payRunEmployeeRepository;

    /**
     * Generate Form 16 PDF for an employee for a financial year
     */
    public byte[] generateForm16(Long employeeId, String financialYear, Long tenantId) {
        log.info("Generating Form 16 for employee: {}, FY: {}", employeeId, financialYear);

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        // Parse financial year
        String[] years = financialYear.split("-");
        int startYear = Integer.parseInt(years[0]);
        LocalDate fyStart = LocalDate.of(startYear, 4, 1);
        LocalDate fyEnd = LocalDate.of(startYear + 1, 3, 31);

        // Get all pay runs for this employee in the FY
        List<PayRun> payRuns = payRunRepository.findByTenantIdAndPayPeriodStartBetween(
                tenantId, fyStart, fyEnd);

        BigDecimal totalGross = BigDecimal.ZERO;
        BigDecimal totalPF = BigDecimal.ZERO;
        BigDecimal totalPT = BigDecimal.ZERO;
        BigDecimal totalTDS = BigDecimal.ZERO;
        BigDecimal totalNet = BigDecimal.ZERO;

        List<Map<String, Object>> monthlyBreakdown = new ArrayList<>();

        for (PayRun payRun : payRuns) {
            Optional<PayRunEmployee> preOpt = payRunEmployeeRepository
                    .findByPayRunIdAndEmployeeId(payRun.getId(), employeeId);

            if (preOpt.isPresent()) {
                PayRunEmployee pre = preOpt.get();
                totalGross = totalGross.add(pre.getGrossSalary() != null ? pre.getGrossSalary() : BigDecimal.ZERO);
                totalPF = totalPF.add(pre.getPfEmployee() != null ? pre.getPfEmployee() : BigDecimal.ZERO);
                totalPT = totalPT.add(pre.getProfessionalTax() != null ? pre.getProfessionalTax() : BigDecimal.ZERO);
                totalTDS = totalTDS.add(pre.getTds() != null ? pre.getTds() : BigDecimal.ZERO);
                totalNet = totalNet.add(pre.getNetSalary() != null ? pre.getNetSalary() : BigDecimal.ZERO);

                Map<String, Object> monthData = new HashMap<>();
                monthData.put("month", payRun.getPayPeriodStart().getMonth().toString());
                monthData.put("gross", pre.getGrossSalary());
                monthData.put("pf", pre.getPfEmployee());
                monthData.put("pt", pre.getProfessionalTax());
                monthData.put("tds", pre.getTds());
                monthData.put("net", pre.getNetSalary());
                monthlyBreakdown.add(monthData);
            }
        }

        try {
            return generateForm16Pdf(employee, financialYear, totalGross, totalPF, totalPT, totalTDS, monthlyBreakdown);
        } catch (Exception e) {
            log.error("Error generating Form 16 PDF", e);
            throw new RuntimeException("Failed to generate Form 16", e);
        }
    }

    private byte[] generateForm16Pdf(Employee employee, String financialYear,
                                      BigDecimal totalGross, BigDecimal totalPF,
                                      BigDecimal totalPT, BigDecimal totalTDS,
                                      List<Map<String, Object>> monthlyBreakdown) throws Exception {

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 36, 36, 54, 36);
        PdfWriter.getInstance(document, baos);

        document.open();

        // Fonts
        Font titleFont = new Font(Font.HELVETICA, 16, Font.BOLD);
        Font headerFont = new Font(Font.HELVETICA, 12, Font.BOLD);
        Font normalFont = new Font(Font.HELVETICA, 10, Font.NORMAL);
        Font smallFont = new Font(Font.HELVETICA, 8, Font.NORMAL);

        // Title
        Paragraph title = new Paragraph("FORM NO. 16", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);

        Paragraph subtitle = new Paragraph("[See rule 31(1)(a)]", smallFont);
        subtitle.setAlignment(Element.ALIGN_CENTER);
        document.add(subtitle);

        Paragraph certTitle = new Paragraph("Certificate under section 203 of the Income-tax Act, 1961 for tax deducted at source from income chargeable under the head \"Salaries\"", normalFont);
        certTitle.setAlignment(Element.ALIGN_CENTER);
        certTitle.setSpacingBefore(10);
        document.add(certTitle);

        document.add(new Paragraph("\n"));

        // Financial Year
        Paragraph fyPara = new Paragraph("Assessment Year: " + financialYear.replace("-", "-20"), headerFont);
        fyPara.setSpacingBefore(10);
        document.add(fyPara);

        document.add(new Paragraph("\n"));

        // Part A - Employer Details
        Paragraph partA = new Paragraph("PART A", headerFont);
        document.add(partA);

        PdfPTable employerTable = new PdfPTable(2);
        employerTable.setWidthPercentage(100);
        employerTable.setSpacingBefore(10);

        addTableRow(employerTable, "Name and address of the Employer", "Organization Name", normalFont);
        addTableRow(employerTable, "TAN of the Deductor", "XXXXXXXXXX", normalFont);
        addTableRow(employerTable, "PAN of the Deductor", "XXXXXXXXXX", normalFont);

        document.add(employerTable);

        document.add(new Paragraph("\n"));

        // Part B - Employee Details
        Paragraph partB = new Paragraph("PART B - Details of Salary Paid and Tax Deducted", headerFont);
        document.add(partB);

        PdfPTable employeeTable = new PdfPTable(2);
        employeeTable.setWidthPercentage(100);
        employeeTable.setSpacingBefore(10);

        addTableRow(employeeTable, "Name of the Employee", employee.getFullName(), normalFont);
        addTableRow(employeeTable, "PAN of the Employee", employee.getPanNumber() != null ? employee.getPanNumber() : "Not Provided", normalFont);
        addTableRow(employeeTable, "Employee ID", employee.getEmployeeId(), normalFont);
        addTableRow(employeeTable, "Designation", employee.getDesignation() != null ? employee.getDesignation() : "-", normalFont);

        document.add(employeeTable);

        document.add(new Paragraph("\n"));

        // Summary Table
        Paragraph summaryTitle = new Paragraph("Summary of Tax Deducted", headerFont);
        document.add(summaryTitle);

        PdfPTable summaryTable = new PdfPTable(2);
        summaryTable.setWidthPercentage(100);
        summaryTable.setSpacingBefore(10);

        addTableRow(summaryTable, "Gross Salary (Section 17(1))", formatCurrency(totalGross), normalFont);
        addTableRow(summaryTable, "Less: Provident Fund (Section 80C)", formatCurrency(totalPF), normalFont);
        addTableRow(summaryTable, "Less: Professional Tax (Section 16(iii))", formatCurrency(totalPT), normalFont);
        addTableRow(summaryTable, "Total Tax Deducted at Source", formatCurrency(totalTDS), normalFont);

        document.add(summaryTable);

        document.add(new Paragraph("\n"));

        // Monthly Breakdown
        if (!monthlyBreakdown.isEmpty()) {
            Paragraph monthlyTitle = new Paragraph("Monthly Breakdown", headerFont);
            document.add(monthlyTitle);

            PdfPTable monthlyTable = new PdfPTable(5);
            monthlyTable.setWidthPercentage(100);
            monthlyTable.setSpacingBefore(10);
            monthlyTable.setWidths(new float[]{2, 2, 1.5f, 1.5f, 2});

            // Headers
            addHeaderCell(monthlyTable, "Month", headerFont);
            addHeaderCell(monthlyTable, "Gross", headerFont);
            addHeaderCell(monthlyTable, "PF", headerFont);
            addHeaderCell(monthlyTable, "PT", headerFont);
            addHeaderCell(monthlyTable, "TDS", headerFont);

            for (Map<String, Object> month : monthlyBreakdown) {
                monthlyTable.addCell(new Phrase(month.get("month").toString(), normalFont));
                monthlyTable.addCell(new Phrase(formatCurrency((BigDecimal) month.get("gross")), normalFont));
                monthlyTable.addCell(new Phrase(formatCurrency((BigDecimal) month.get("pf")), normalFont));
                monthlyTable.addCell(new Phrase(formatCurrency((BigDecimal) month.get("pt")), normalFont));
                monthlyTable.addCell(new Phrase(formatCurrency((BigDecimal) month.get("tds")), normalFont));
            }

            document.add(monthlyTable);
        }

        document.add(new Paragraph("\n\n"));

        // Verification
        Paragraph verification = new Paragraph("VERIFICATION", headerFont);
        document.add(verification);

        Paragraph verificationText = new Paragraph(
                "I, _________________, son/daughter of _________________, working in the capacity of _________________ " +
                        "do hereby certify that a sum of Rs. " + formatCurrency(totalTDS) + " has been deducted at source and paid to the credit of the Central Government.",
                normalFont);
        verificationText.setSpacingBefore(10);
        document.add(verificationText);

        document.add(new Paragraph("\n\n"));

        // Signature
        Paragraph signature = new Paragraph("Place: _____________\nDate: _____________\n\nSignature of the person responsible for deduction of tax", normalFont);
        signature.setAlignment(Element.ALIGN_RIGHT);
        document.add(signature);

        document.close();

        return baos.toByteArray();
    }

    private void addTableRow(PdfPTable table, String label, String value, Font font) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, font));
        labelCell.setBorder(Rectangle.BOX);
        labelCell.setPadding(5);
        labelCell.setBackgroundColor(new java.awt.Color(240, 240, 240));

        PdfPCell valueCell = new PdfPCell(new Phrase(value, font));
        valueCell.setBorder(Rectangle.BOX);
        valueCell.setPadding(5);

        table.addCell(labelCell);
        table.addCell(valueCell);
    }

    private void addHeaderCell(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBorder(Rectangle.BOX);
        cell.setPadding(5);
        cell.setBackgroundColor(new java.awt.Color(200, 200, 200));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(cell);
    }

    private String formatCurrency(BigDecimal amount) {
        if (amount == null) return "₹0";
        return "₹" + String.format("%,.0f", amount);
    }

    /**
     * Get Form 16 data without generating PDF
     */
    public Map<String, Object> getForm16Data(Long employeeId, String financialYear, Long tenantId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        String[] years = financialYear.split("-");
        int startYear = Integer.parseInt(years[0]);
        LocalDate fyStart = LocalDate.of(startYear, 4, 1);
        LocalDate fyEnd = LocalDate.of(startYear + 1, 3, 31);

        List<PayRun> payRuns = payRunRepository.findByTenantIdAndPayPeriodStartBetween(
                tenantId, fyStart, fyEnd);

        BigDecimal totalGross = BigDecimal.ZERO;
        BigDecimal totalBasic = BigDecimal.ZERO;
        BigDecimal totalHRA = BigDecimal.ZERO;
        BigDecimal totalPF = BigDecimal.ZERO;
        BigDecimal totalPT = BigDecimal.ZERO;
        BigDecimal totalTDS = BigDecimal.ZERO;

        for (PayRun payRun : payRuns) {
            Optional<PayRunEmployee> preOpt = payRunEmployeeRepository
                    .findByPayRunIdAndEmployeeId(payRun.getId(), employeeId);

            if (preOpt.isPresent()) {
                PayRunEmployee pre = preOpt.get();
                totalGross = totalGross.add(pre.getGrossSalary() != null ? pre.getGrossSalary() : BigDecimal.ZERO);
                totalBasic = totalBasic.add(pre.getBasicSalary() != null ? pre.getBasicSalary() : BigDecimal.ZERO);
                totalHRA = totalHRA.add(pre.getHra() != null ? pre.getHra() : BigDecimal.ZERO);
                totalPF = totalPF.add(pre.getPfEmployee() != null ? pre.getPfEmployee() : BigDecimal.ZERO);
                totalPT = totalPT.add(pre.getProfessionalTax() != null ? pre.getProfessionalTax() : BigDecimal.ZERO);
                totalTDS = totalTDS.add(pre.getTds() != null ? pre.getTds() : BigDecimal.ZERO);
            }
        }

        Map<String, Object> data = new HashMap<>();
        data.put("employeeId", employee.getEmployeeId());
        data.put("employeeName", employee.getFullName());
        data.put("pan", employee.getPanNumber());
        data.put("financialYear", financialYear);
        data.put("totalGross", totalGross);
        data.put("totalBasic", totalBasic);
        data.put("totalHRA", totalHRA);
        data.put("totalPF", totalPF);
        data.put("totalPT", totalPT);
        data.put("totalTDS", totalTDS);
        data.put("taxableIncome", totalGross.subtract(totalPF).subtract(totalPT));

        return data;
    }
}
