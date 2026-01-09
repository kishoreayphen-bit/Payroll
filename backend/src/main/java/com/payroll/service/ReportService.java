package com.payroll.service;

import com.payroll.entity.*;
import com.payroll.repository.*;
import com.payroll.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportService {

    private final EmployeeRepository employeeRepository;
    private final PayRunRepository payRunRepository;
    private final PayRunEmployeeRepository payRunEmployeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;

    // ==================== PAYROLL REPORTS ====================

    public Map<String, Object> getPayrollSummaryReport(Long tenantId, int month, int year) {
        log.info("Generating payroll summary report for tenant: {}, month: {}/{}", tenantId, month, year);
        
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        
        List<PayRun> payRuns = payRunRepository.findByTenantIdAndPayPeriodStartBetween(
            tenantId, startDate, endDate);
        
        Map<String, Object> report = new HashMap<>();
        report.put("month", month);
        report.put("year", year);
        report.put("generatedAt", LocalDate.now());
        
        BigDecimal totalGross = BigDecimal.ZERO;
        BigDecimal totalDeductions = BigDecimal.ZERO;
        BigDecimal totalNet = BigDecimal.ZERO;
        BigDecimal totalPF = BigDecimal.ZERO;
        BigDecimal totalESI = BigDecimal.ZERO;
        BigDecimal totalPT = BigDecimal.ZERO;
        BigDecimal totalTDS = BigDecimal.ZERO;
        int employeeCount = 0;
        
        List<Map<String, Object>> payRunDetails = new ArrayList<>();
        
        for (PayRun payRun : payRuns) {
            List<PayRunEmployee> employees = payRunEmployeeRepository.findByPayRunId(payRun.getId());
            
            for (PayRunEmployee pre : employees) {
                totalGross = totalGross.add(pre.getGrossSalary() != null ? pre.getGrossSalary() : BigDecimal.ZERO);
                totalDeductions = totalDeductions.add(pre.getTotalDeductions() != null ? pre.getTotalDeductions() : BigDecimal.ZERO);
                totalNet = totalNet.add(pre.getNetSalary() != null ? pre.getNetSalary() : BigDecimal.ZERO);
                totalPF = totalPF.add(pre.getPfEmployee() != null ? pre.getPfEmployee() : BigDecimal.ZERO);
                totalESI = totalESI.add(pre.getEsiEmployee() != null ? pre.getEsiEmployee() : BigDecimal.ZERO);
                totalPT = totalPT.add(pre.getProfessionalTax() != null ? pre.getProfessionalTax() : BigDecimal.ZERO);
                totalTDS = totalTDS.add(pre.getTds() != null ? pre.getTds() : BigDecimal.ZERO);
                employeeCount++;
            }
            
            Map<String, Object> prDetail = new HashMap<>();
            prDetail.put("payRunId", payRun.getId());
            prDetail.put("status", payRun.getStatus());
            prDetail.put("periodStart", payRun.getPayPeriodStart());
            prDetail.put("periodEnd", payRun.getPayPeriodEnd());
            prDetail.put("totalGross", payRun.getTotalGrossPay());
            prDetail.put("totalNet", payRun.getTotalNetPay());
            prDetail.put("employeeCount", employees.size());
            payRunDetails.add(prDetail);
        }
        
        report.put("summary", Map.of(
            "totalGrossPay", totalGross,
            "totalDeductions", totalDeductions,
            "totalNetPay", totalNet,
            "totalPF", totalPF,
            "totalESI", totalESI,
            "totalPT", totalPT,
            "totalTDS", totalTDS,
            "employeeCount", employeeCount,
            "payRunCount", payRuns.size()
        ));
        report.put("payRuns", payRunDetails);
        
        return report;
    }

    public List<Map<String, Object>> getEmployeePayrollReport(Long tenantId, Long employeeId, int year) {
        log.info("Generating employee payroll report for employee: {} in year: {}", employeeId, year);
        
        List<Map<String, Object>> monthlyData = new ArrayList<>();
        
        for (int month = 1; month <= 12; month++) {
            LocalDate startDate = LocalDate.of(year, month, 1);
            LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
            
            List<PayRun> payRuns = payRunRepository.findByTenantIdAndPayPeriodStartBetween(
                tenantId, startDate, endDate);
            
            for (PayRun payRun : payRuns) {
                Optional<PayRunEmployee> preOpt = payRunEmployeeRepository
                    .findByPayRunIdAndEmployeeId(payRun.getId(), employeeId);
                
                if (preOpt.isPresent()) {
                    PayRunEmployee pre = preOpt.get();
                    Map<String, Object> data = new HashMap<>();
                    data.put("month", month);
                    data.put("year", year);
                    data.put("monthName", YearMonth.of(year, month).getMonth().toString());
                    data.put("basicSalary", pre.getBasicSalary());
                    data.put("hra", pre.getHra());
                    data.put("conveyance", pre.getConveyanceAllowance());
                    data.put("fixedAllowance", pre.getFixedAllowance());
                    data.put("grossSalary", pre.getGrossSalary());
                    data.put("pfEmployee", pre.getPfEmployee());
                    data.put("esiEmployee", pre.getEsiEmployee());
                    data.put("professionalTax", pre.getProfessionalTax());
                    data.put("tds", pre.getTds());
                    data.put("lopDays", pre.getLopDays());
                    data.put("lopDeduction", pre.getLopDeduction());
                    data.put("totalDeductions", pre.getTotalDeductions());
                    data.put("netSalary", pre.getNetSalary());
                    data.put("payRunStatus", payRun.getStatus());
                    monthlyData.add(data);
                }
            }
        }
        
        return monthlyData;
    }

    // ==================== TAX REPORTS ====================

    public Map<String, Object> getTaxSummaryReport(Long tenantId, String financialYear) {
        log.info("Generating tax summary report for tenant: {}, FY: {}", tenantId, financialYear);
        
        // Parse financial year (e.g., "2025-26")
        String[] years = financialYear.split("-");
        int startYear = Integer.parseInt(years[0]);
        
        LocalDate fyStart = LocalDate.of(startYear, 4, 1);
        LocalDate fyEnd = LocalDate.of(startYear + 1, 3, 31);
        
        List<Employee> employees = employeeRepository.findByTenantId(tenantId);
        List<Map<String, Object>> employeeTaxData = new ArrayList<>();
        
        BigDecimal totalTaxDeducted = BigDecimal.ZERO;
        
        for (Employee emp : employees) {
            BigDecimal empTotalTax = BigDecimal.ZERO;
            BigDecimal empTotalGross = BigDecimal.ZERO;
            
            // Get all pay runs for this employee in the FY
            List<PayRun> payRuns = payRunRepository.findByTenantIdAndPayPeriodStartBetween(
                tenantId, fyStart, fyEnd);
            
            for (PayRun payRun : payRuns) {
                Optional<PayRunEmployee> preOpt = payRunEmployeeRepository
                    .findByPayRunIdAndEmployeeId(payRun.getId(), emp.getId());
                
                if (preOpt.isPresent()) {
                    PayRunEmployee pre = preOpt.get();
                    empTotalTax = empTotalTax.add(pre.getTds() != null ? pre.getTds() : BigDecimal.ZERO);
                    empTotalGross = empTotalGross.add(pre.getGrossSalary() != null ? pre.getGrossSalary() : BigDecimal.ZERO);
                }
            }
            
            if (empTotalGross.compareTo(BigDecimal.ZERO) > 0) {
                Map<String, Object> empData = new HashMap<>();
                empData.put("employeeId", emp.getEmployeeId());
                empData.put("name", emp.getFirstName() + " " + emp.getLastName());
                empData.put("pan", emp.getPanNumber());
                empData.put("totalGross", empTotalGross);
                empData.put("totalTaxDeducted", empTotalTax);
                employeeTaxData.add(empData);
                
                totalTaxDeducted = totalTaxDeducted.add(empTotalTax);
            }
        }
        
        Map<String, Object> report = new HashMap<>();
        report.put("financialYear", financialYear);
        report.put("generatedAt", LocalDate.now());
        report.put("totalTaxDeducted", totalTaxDeducted);
        report.put("employeeCount", employeeTaxData.size());
        report.put("employees", employeeTaxData);
        
        return report;
    }

    // ==================== COMPLIANCE REPORTS ====================

    public Map<String, Object> getPFReport(Long tenantId, int month, int year) {
        log.info("Generating PF report for tenant: {}, month: {}/{}", tenantId, month, year);
        
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        
        List<PayRun> payRuns = payRunRepository.findByTenantIdAndPayPeriodStartBetween(
            tenantId, startDate, endDate);
        
        List<Map<String, Object>> pfData = new ArrayList<>();
        BigDecimal totalEmployeePF = BigDecimal.ZERO;
        BigDecimal totalEmployerPF = BigDecimal.ZERO;
        
        for (PayRun payRun : payRuns) {
            List<PayRunEmployee> employees = payRunEmployeeRepository.findByPayRunId(payRun.getId());
            
            for (PayRunEmployee pre : employees) {
                Employee emp = pre.getEmployee();
                
                Map<String, Object> data = new HashMap<>();
                data.put("employeeId", emp.getEmployeeId());
                data.put("name", emp.getFirstName() + " " + emp.getLastName());
                data.put("uan", emp.getUan());
                data.put("pfNumber", emp.getPfNumber());
                data.put("basicWages", pre.getBasicSalary());
                data.put("employeeShare", pre.getPfEmployee());
                data.put("employerShare", pre.getPfEmployer());
                data.put("total", pre.getPfEmployee().add(pre.getPfEmployer()));
                pfData.add(data);
                
                totalEmployeePF = totalEmployeePF.add(pre.getPfEmployee() != null ? pre.getPfEmployee() : BigDecimal.ZERO);
                totalEmployerPF = totalEmployerPF.add(pre.getPfEmployer() != null ? pre.getPfEmployer() : BigDecimal.ZERO);
            }
        }
        
        Map<String, Object> report = new HashMap<>();
        report.put("month", month);
        report.put("year", year);
        report.put("generatedAt", LocalDate.now());
        report.put("dueDate", LocalDate.of(year, month, 1).plusMonths(1).withDayOfMonth(15));
        report.put("totalEmployeeContribution", totalEmployeePF);
        report.put("totalEmployerContribution", totalEmployerPF);
        report.put("grandTotal", totalEmployeePF.add(totalEmployerPF));
        report.put("employees", pfData);
        
        return report;
    }

    public Map<String, Object> getESIReport(Long tenantId, int month, int year) {
        log.info("Generating ESI report for tenant: {}, month: {}/{}", tenantId, month, year);
        
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        
        List<PayRun> payRuns = payRunRepository.findByTenantIdAndPayPeriodStartBetween(
            tenantId, startDate, endDate);
        
        List<Map<String, Object>> esiData = new ArrayList<>();
        BigDecimal totalEmployeeESI = BigDecimal.ZERO;
        BigDecimal totalEmployerESI = BigDecimal.ZERO;
        
        for (PayRun payRun : payRuns) {
            List<PayRunEmployee> employees = payRunEmployeeRepository.findByPayRunId(payRun.getId());
            
            for (PayRunEmployee pre : employees) {
                if (pre.getEsiEmployee() != null && pre.getEsiEmployee().compareTo(BigDecimal.ZERO) > 0) {
                    Employee emp = pre.getEmployee();
                    
                    Map<String, Object> data = new HashMap<>();
                    data.put("employeeId", emp.getEmployeeId());
                    data.put("name", emp.getFirstName() + " " + emp.getLastName());
                    data.put("esiNumber", emp.getEsiNumber());
                    data.put("grossWages", pre.getGrossSalary());
                    data.put("employeeShare", pre.getEsiEmployee());
                    data.put("employerShare", pre.getEsiEmployer());
                    data.put("total", pre.getEsiEmployee().add(pre.getEsiEmployer()));
                    esiData.add(data);
                    
                    totalEmployeeESI = totalEmployeeESI.add(pre.getEsiEmployee());
                    totalEmployerESI = totalEmployerESI.add(pre.getEsiEmployer() != null ? pre.getEsiEmployer() : BigDecimal.ZERO);
                }
            }
        }
        
        Map<String, Object> report = new HashMap<>();
        report.put("month", month);
        report.put("year", year);
        report.put("generatedAt", LocalDate.now());
        report.put("dueDate", LocalDate.of(year, month, 1).plusMonths(1).withDayOfMonth(15));
        report.put("totalEmployeeContribution", totalEmployeeESI);
        report.put("totalEmployerContribution", totalEmployerESI);
        report.put("grandTotal", totalEmployeeESI.add(totalEmployerESI));
        report.put("eligibleEmployees", esiData.size());
        report.put("employees", esiData);
        
        return report;
    }

    // ==================== ATTENDANCE REPORTS ====================

    public Map<String, Object> getAttendanceReport(Long tenantId, int month, int year) {
        log.info("Generating attendance report for tenant: {}, month: {}/{}", tenantId, month, year);
        
        List<Employee> employees = employeeRepository.findByTenantId(tenantId);
        List<Map<String, Object>> attendanceData = new ArrayList<>();
        
        int totalPresent = 0;
        int totalAbsent = 0;
        int totalLeave = 0;
        int totalHalfDay = 0;
        
        for (Employee emp : employees) {
            List<Attendance> records = attendanceRepository.findByEmployeeIdAndMonthYear(
                emp.getId(), month, year);
            
            int present = 0, absent = 0, leave = 0, halfDay = 0, holiday = 0, weekend = 0;
            
            for (Attendance att : records) {
                switch (att.getStatus()) {
                    case "PRESENT": present++; break;
                    case "ABSENT": absent++; break;
                    case "LEAVE": leave++; break;
                    case "HALF_DAY": halfDay++; break;
                    case "HOLIDAY": holiday++; break;
                    case "WEEKEND": weekend++; break;
                }
            }
            
            Map<String, Object> data = new HashMap<>();
            data.put("employeeId", emp.getEmployeeId());
            data.put("name", emp.getFirstName() + " " + emp.getLastName());
            data.put("department", emp.getDepartment());
            data.put("present", present);
            data.put("absent", absent);
            data.put("leave", leave);
            data.put("halfDay", halfDay);
            data.put("holiday", holiday);
            data.put("weekend", weekend);
            data.put("totalRecords", records.size());
            data.put("attendanceRate", records.size() > 0 ? 
                Math.round((present + halfDay * 0.5) / (double)(present + absent + halfDay) * 100) : 0);
            attendanceData.add(data);
            
            totalPresent += present;
            totalAbsent += absent;
            totalLeave += leave;
            totalHalfDay += halfDay;
        }
        
        Map<String, Object> report = new HashMap<>();
        report.put("month", month);
        report.put("year", year);
        report.put("generatedAt", LocalDate.now());
        report.put("summary", Map.of(
            "totalEmployees", employees.size(),
            "totalPresent", totalPresent,
            "totalAbsent", totalAbsent,
            "totalLeave", totalLeave,
            "totalHalfDay", totalHalfDay
        ));
        report.put("employees", attendanceData);
        
        return report;
    }

    // ==================== EXCEL EXPORT ====================

    public byte[] exportPayrollToExcel(Long tenantId, int month, int year) throws Exception {
        Map<String, Object> report = getPayrollSummaryReport(tenantId, month, year);
        
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Payroll Report");
            
            // Header style
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            
            // Title row
            Row titleRow = sheet.createRow(0);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("Payroll Report - " + month + "/" + year);
            
            // Summary section
            Row summaryHeaderRow = sheet.createRow(2);
            summaryHeaderRow.createCell(0).setCellValue("Summary");
            
            @SuppressWarnings("unchecked")
            Map<String, Object> summary = (Map<String, Object>) report.get("summary");
            
            int rowNum = 3;
            for (Map.Entry<String, Object> entry : summary.entrySet()) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(entry.getKey());
                row.createCell(1).setCellValue(entry.getValue().toString());
            }
            
            // Auto-size columns
            for (int i = 0; i < 10; i++) {
                sheet.autoSizeColumn(i);
            }
            
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        }
    }

    public byte[] exportAttendanceToExcel(Long tenantId, int month, int year) throws Exception {
        Map<String, Object> report = getAttendanceReport(tenantId, month, year);
        
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Attendance Report");
            
            // Header style
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            
            // Headers
            Row headerRow = sheet.createRow(0);
            String[] headers = {"Employee ID", "Name", "Department", "Present", "Absent", "Leave", "Half Day", "Attendance %"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }
            
            // Data
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> employees = (List<Map<String, Object>>) report.get("employees");
            
            int rowNum = 1;
            for (Map<String, Object> emp : employees) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(emp.get("employeeId").toString());
                row.createCell(1).setCellValue(emp.get("name").toString());
                row.createCell(2).setCellValue(emp.get("department") != null ? emp.get("department").toString() : "");
                row.createCell(3).setCellValue((Integer) emp.get("present"));
                row.createCell(4).setCellValue((Integer) emp.get("absent"));
                row.createCell(5).setCellValue((Integer) emp.get("leave"));
                row.createCell(6).setCellValue((Integer) emp.get("halfDay"));
                row.createCell(7).setCellValue(emp.get("attendanceRate") + "%");
            }
            
            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        }
    }
}
