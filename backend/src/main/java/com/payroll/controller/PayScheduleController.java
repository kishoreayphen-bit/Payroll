package com.payroll.controller;

import com.payroll.dto.PayScheduleDTO;
import com.payroll.service.PayScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/pay-schedules")
@CrossOrigin(origins = "*")
public class PayScheduleController {

    @Autowired
    private PayScheduleService payScheduleService;

    @GetMapping("/organization/{organizationId}")
    public ResponseEntity<List<PayScheduleDTO>> getPaySchedules(@PathVariable Long organizationId) {
        List<PayScheduleDTO> schedules = payScheduleService.getPaySchedulesByOrganization(organizationId);
        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/organization/{organizationId}/active")
    public ResponseEntity<List<PayScheduleDTO>> getActivePaySchedules(@PathVariable Long organizationId) {
        List<PayScheduleDTO> schedules = payScheduleService.getActivePaySchedules(organizationId);
        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/{id}/organization/{organizationId}")
    public ResponseEntity<PayScheduleDTO> getPayScheduleById(
            @PathVariable Long id,
            @PathVariable Long organizationId) {
        PayScheduleDTO schedule = payScheduleService.getPayScheduleById(id, organizationId);
        return ResponseEntity.ok(schedule);
    }

    @GetMapping("/organization/{organizationId}/default")
    public ResponseEntity<PayScheduleDTO> getDefaultPaySchedule(@PathVariable Long organizationId) {
        PayScheduleDTO schedule = payScheduleService.getDefaultPaySchedule(organizationId);
        if (schedule == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(schedule);
    }

    @PostMapping
    public ResponseEntity<?> createPaySchedule(@RequestBody PayScheduleDTO dto) {
        try {
            PayScheduleDTO created = payScheduleService.createPaySchedule(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePaySchedule(@PathVariable Long id, @RequestBody PayScheduleDTO dto) {
        try {
            PayScheduleDTO updated = payScheduleService.updatePaySchedule(id, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}/organization/{organizationId}")
    public ResponseEntity<?> deletePaySchedule(
            @PathVariable Long id,
            @PathVariable Long organizationId) {
        try {
            payScheduleService.deletePaySchedule(id, organizationId);
            return ResponseEntity.ok(Map.of("message", "Pay schedule deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/organization/{organizationId}/set-default")
    public ResponseEntity<?> setAsDefault(
            @PathVariable Long id,
            @PathVariable Long organizationId) {
        try {
            PayScheduleDTO updated = payScheduleService.setAsDefault(id, organizationId);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
