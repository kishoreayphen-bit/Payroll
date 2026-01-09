package com.payroll.controller;

import com.payroll.entity.OrganizationSettings;
import com.payroll.entity.Holiday;
import com.payroll.service.OrganizationSettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/organization-settings")
@CrossOrigin(origins = "*")
public class OrganizationSettingsController {

    @Autowired
    private OrganizationSettingsService settingsService;

    @GetMapping
    public ResponseEntity<OrganizationSettings> getSettings(
            @RequestHeader("X-Tenant-ID") Long tenantId) {
        return ResponseEntity.ok(settingsService.getOrCreateSettings(tenantId));
    }

    @PutMapping
    public ResponseEntity<OrganizationSettings> updateSettings(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @RequestBody OrganizationSettings settings) {
        return ResponseEntity.ok(settingsService.updateSettings(tenantId, settings));
    }

    // Holiday endpoints
    @GetMapping("/holidays")
    public ResponseEntity<List<Holiday>> getHolidays(
            @RequestHeader("X-Tenant-ID") Long tenantId) {
        return ResponseEntity.ok(settingsService.getHolidays(tenantId));
    }

    @GetMapping("/holidays/year/{year}")
    public ResponseEntity<List<Holiday>> getHolidaysForYear(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @PathVariable int year) {
        return ResponseEntity.ok(settingsService.getHolidaysForYear(tenantId, year));
    }

    @GetMapping("/holidays/month")
    public ResponseEntity<List<Holiday>> getHolidaysForMonth(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @RequestParam int month,
            @RequestParam int year) {
        return ResponseEntity.ok(settingsService.getHolidaysForMonth(tenantId, month, year));
    }

    @PostMapping("/holidays")
    public ResponseEntity<Holiday> addHoliday(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @RequestBody Holiday holiday) {
        holiday.setOrganizationId(tenantId);
        return ResponseEntity.ok(settingsService.addHoliday(holiday));
    }

    @DeleteMapping("/holidays/{id}")
    public ResponseEntity<Map<String, String>> deleteHoliday(
            @PathVariable Long id) {
        settingsService.deleteHoliday(id);
        return ResponseEntity.ok(Map.of("message", "Holiday deleted successfully"));
    }

    @PostMapping("/holidays/initialize/{year}")
    public ResponseEntity<Map<String, String>> initializeDefaultHolidays(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @PathVariable int year) {
        System.out.println("=== MANUAL HOLIDAY INITIALIZATION ===");
        System.out.println("Tenant ID: " + tenantId + ", Year: " + year);
        try {
            settingsService.initializeDefaultHolidays(tenantId, year);
            System.out.println("Holidays initialized successfully");
            return ResponseEntity.ok(Map.of(
                "message", "Default holidays initialized for " + year,
                "details", "National and state holidays added"
            ));
        } catch (Exception e) {
            System.err.println("ERROR initializing holidays: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @GetMapping("/holidays/test")
    public ResponseEntity<Map<String, Object>> testHolidayTables(
            @RequestHeader("X-Tenant-ID") Long tenantId) {
        try {
            List<Holiday> holidays = settingsService.getHolidays(tenantId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "holidayCount", holidays.size(),
                "message", "Holiday table exists and accessible"
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "success", false,
                "error", e.getMessage(),
                "message", "Holiday table may not exist"
            ));
        }
    }
}
