package com.payroll.controller;

import com.payroll.service.ReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ReportController {

    private final ReportService reportService;

    // ==================== PAYROLL REPORTS ====================

    @GetMapping("/payroll/summary")
    public ResponseEntity<Map<String, Object>> getPayrollSummaryReport(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @RequestParam int month,
            @RequestParam int year) {
        log.info("Generating payroll summary report for tenant: {}, {}/{}", tenantId, month, year);
        return ResponseEntity.ok(reportService.getPayrollSummaryReport(tenantId, month, year));
    }

    @GetMapping("/payroll/employee/{employeeId}")
    public ResponseEntity<List<Map<String, Object>>> getEmployeePayrollReport(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @PathVariable Long employeeId,
            @RequestParam int year) {
        log.info("Generating employee payroll report for employee: {} in year: {}", employeeId, year);
        return ResponseEntity.ok(reportService.getEmployeePayrollReport(tenantId, employeeId, year));
    }

    // ==================== TAX REPORTS ====================

    @GetMapping("/tax/summary")
    public ResponseEntity<Map<String, Object>> getTaxSummaryReport(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @RequestParam String financialYear) {
        log.info("Generating tax summary report for tenant: {}, FY: {}", tenantId, financialYear);
        return ResponseEntity.ok(reportService.getTaxSummaryReport(tenantId, financialYear));
    }

    // ==================== COMPLIANCE REPORTS ====================

    @GetMapping("/compliance/pf")
    public ResponseEntity<Map<String, Object>> getPFReport(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @RequestParam int month,
            @RequestParam int year) {
        log.info("Generating PF report for tenant: {}, {}/{}", tenantId, month, year);
        return ResponseEntity.ok(reportService.getPFReport(tenantId, month, year));
    }

    @GetMapping("/compliance/esi")
    public ResponseEntity<Map<String, Object>> getESIReport(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @RequestParam int month,
            @RequestParam int year) {
        log.info("Generating ESI report for tenant: {}, {}/{}", tenantId, month, year);
        return ResponseEntity.ok(reportService.getESIReport(tenantId, month, year));
    }

    // ==================== ATTENDANCE REPORTS ====================

    @GetMapping("/attendance")
    public ResponseEntity<Map<String, Object>> getAttendanceReport(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @RequestParam int month,
            @RequestParam int year) {
        log.info("Generating attendance report for tenant: {}, {}/{}", tenantId, month, year);
        return ResponseEntity.ok(reportService.getAttendanceReport(tenantId, month, year));
    }

    // ==================== EXCEL EXPORTS ====================

    @GetMapping("/export/payroll")
    public ResponseEntity<byte[]> exportPayrollToExcel(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @RequestParam int month,
            @RequestParam int year) {
        try {
            log.info("Exporting payroll report to Excel for tenant: {}, {}/{}", tenantId, month, year);
            byte[] excelData = reportService.exportPayrollToExcel(tenantId, month, year);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", 
                String.format("payroll_report_%d_%d.xlsx", month, year));
            
            return ResponseEntity.ok().headers(headers).body(excelData);
        } catch (Exception e) {
            log.error("Error exporting payroll to Excel", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/export/attendance")
    public ResponseEntity<byte[]> exportAttendanceToExcel(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @RequestParam int month,
            @RequestParam int year) {
        try {
            log.info("Exporting attendance report to Excel for tenant: {}, {}/{}", tenantId, month, year);
            byte[] excelData = reportService.exportAttendanceToExcel(tenantId, month, year);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", 
                String.format("attendance_report_%d_%d.xlsx", month, year));
            
            return ResponseEntity.ok().headers(headers).body(excelData);
        } catch (Exception e) {
            log.error("Error exporting attendance to Excel", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
