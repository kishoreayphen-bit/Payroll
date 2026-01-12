package com.payroll.controller;

import com.payroll.entity.Attendance;
import com.payroll.service.AttendanceService;
import com.payroll.service.AttendanceImportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    private AttendanceImportService attendanceImportService;

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Attendance>> getEmployeeAttendance(
            @PathVariable Long employeeId,
            @RequestHeader("X-Tenant-ID") Long tenantId) {
        return ResponseEntity.ok(attendanceService.getAttendanceByEmployee(employeeId, tenantId));
    }

    @GetMapping("/range")
    public ResponseEntity<List<Attendance>> getAttendanceByDateRange(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(attendanceService.getAttendanceByDateRange(tenantId, startDate, endDate));
    }

    @GetMapping("/employee/{employeeId}/range")
    public ResponseEntity<List<Attendance>> getEmployeeAttendanceByDateRange(
            @PathVariable Long employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(attendanceService.getEmployeeAttendanceByDateRange(employeeId, startDate, endDate));
    }

    @GetMapping("/month")
    public ResponseEntity<List<Attendance>> getAttendanceByMonthYear(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @RequestParam int month,
            @RequestParam int year) {
        return ResponseEntity.ok(attendanceService.getAttendanceByMonthYear(tenantId, month, year));
    }

    @PostMapping
    public ResponseEntity<Attendance> markAttendance(
            @RequestBody Attendance attendance,
            @RequestHeader("X-Tenant-ID") Long tenantId) {
        attendance.setOrganizationId(tenantId);
        return ResponseEntity.ok(attendanceService.markAttendance(attendance));
    }

    @PostMapping("/check-in")
    public ResponseEntity<Attendance> checkIn(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @RequestHeader("X-Employee-ID") Long employeeId) {
        return ResponseEntity.ok(attendanceService.checkIn(employeeId, tenantId));
    }

    @PostMapping("/check-out")
    public ResponseEntity<Attendance> checkOut(
            @RequestHeader("X-Employee-ID") Long employeeId) {
        return ResponseEntity.ok(attendanceService.checkOut(employeeId));
    }

    @PostMapping("/bulk")
    public ResponseEntity<String> bulkMarkAttendance(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestBody List<Map<String, Object>> attendanceData) {
        attendanceService.bulkMarkAttendance(tenantId, date, attendanceData);
        return ResponseEntity.ok("Attendance marked successfully");
    }

    @GetMapping("/summary/employee/{employeeId}")
    public ResponseEntity<Map<String, Object>> getEmployeeSummary(
            @PathVariable Long employeeId,
            @RequestParam int month,
            @RequestParam int year) {
        return ResponseEntity.ok(attendanceService.getAttendanceSummary(employeeId, month, year));
    }

    @GetMapping("/summary/organization")
    public ResponseEntity<Map<String, Object>> getOrganizationSummary(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(attendanceService.getOrganizationAttendanceSummary(tenantId, date));
    }

    @PostMapping("/initialize")
    public ResponseEntity<String> initializeMonthAttendance(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @RequestParam int month,
            @RequestParam int year) {
        attendanceService.initializeMonthAttendance(tenantId, month, year);
        return ResponseEntity.ok("Month attendance initialized");
    }

    @GetMapping("/lop/{employeeId}")
    public ResponseEntity<Double> getLopDays(
            @PathVariable Long employeeId,
            @RequestParam int month,
            @RequestParam int year) {
        return ResponseEntity.ok(attendanceService.calculateLopDays(employeeId, month, year));
    }

    @PostMapping("/bulk/mark-all-present")
    public ResponseEntity<Map<String, String>> markAllEmployeesPresent(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        attendanceService.markAllEmployeesPresent(tenantId, date);
        return ResponseEntity.ok(Map.of("message", "All employees marked present for " + date));
    }

    @PostMapping("/bulk/mark-month")
    public ResponseEntity<Map<String, String>> markEmployeeForMonth(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @RequestBody Map<String, Object> request) {
        Long employeeId = Long.valueOf(request.get("employeeId").toString());
        int month = Integer.parseInt(request.get("month").toString());
        int year = Integer.parseInt(request.get("year").toString());
        String status = request.get("status").toString();
        
        attendanceService.markEmployeeForMonth(employeeId, tenantId, month, year, status);
        return ResponseEntity.ok(Map.of("message", "Employee attendance marked for entire month"));
    }

    @PostMapping("/bulk/mark-all-month")
    public ResponseEntity<Map<String, String>> markAllEmployeesForMonth(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @RequestParam int month,
            @RequestParam int year,
            @RequestParam String status) {
        attendanceService.markAllEmployeesForMonth(tenantId, month, year, status);
        return ResponseEntity.ok(Map.of("message", "All employees marked " + status + " for month"));
    }

    @PostMapping("/auto-initialize")
    public ResponseEntity<Map<String, String>> autoInitializeAttendance(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @RequestParam int month,
            @RequestParam int year) {
        System.out.println("=== AUTO-INITIALIZE CALLED ===");
        System.out.println("Tenant ID: " + tenantId + ", Month: " + month + ", Year: " + year);
        attendanceService.autoInitializeAttendanceForMonth(tenantId, month, year);
        System.out.println("=== AUTO-INITIALIZE COMPLETED ===");
        return ResponseEntity.ok(Map.of(
            "message", "Attendance auto-initialized for " + month + "/" + year,
            "details", "Government holidays, weekends, and working days marked automatically"
        ));
    }

    @DeleteMapping("/reset-month")
    public ResponseEntity<Map<String, Object>> resetAttendanceForMonth(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @RequestParam int month,
            @RequestParam int year) {
        int deletedCount = attendanceService.resetAttendanceForMonth(tenantId, month, year);
        return ResponseEntity.ok(Map.of(
            "message", "Attendance cleared for " + month + "/" + year,
            "deletedRecords", deletedCount
        ));
    }

    @PostMapping("/import")
    public ResponseEntity<Map<String, Object>> importAttendance(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Please select a file to upload"
                ));
            }

            String filename = file.getOriginalFilename();
            if (filename == null || (!filename.endsWith(".xlsx") && !filename.endsWith(".xls"))) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Please upload a valid Excel file (.xlsx or .xls)"
                ));
            }

            // Use pivot-style import (Date rows, Employee columns)
            Map<String, Object> result = attendanceImportService.importAttendanceFromPivotExcel(file, tenantId);
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "message", "Failed to import attendance: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/import/template")
    public ResponseEntity<byte[]> downloadImportTemplate() {
        try {
            byte[] template = attendanceImportService.generateTemplate();
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "attendance_import_template.xlsx");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(template);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
