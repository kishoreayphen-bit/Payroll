package com.payroll.controller;

import com.payroll.dto.EmployeeRequestDTO;
import com.payroll.dto.EmployeeResponseDTO;
import com.payroll.dto.EmployeeExitDTO;
import com.payroll.dto.FinalSettlementDTO;
import com.payroll.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @PostMapping
    public ResponseEntity<?> createEmployee(
            @RequestBody EmployeeRequestDTO requestDTO,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            EmployeeResponseDTO response = employeeService.createEmployee(requestDTO, userEmail);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllEmployees(@RequestParam Long organizationId) {
        try {
            List<EmployeeResponseDTO> employees = employeeService.getAllEmployeesByOrganization(organizationId);
            return ResponseEntity.ok(employees);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEmployeeById(@PathVariable Long id) {
        try {
            EmployeeResponseDTO employee = employeeService.getEmployeeById(id);
            return ResponseEntity.ok(employee);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmployee(
            @PathVariable Long id,
            @RequestBody EmployeeRequestDTO requestDTO) {
        try {
            EmployeeResponseDTO response = employeeService.updateEmployee(id, requestDTO);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        try {
            employeeService.deleteEmployee(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Employee deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @GetMapping("/organization/{organizationId}")
    public ResponseEntity<?> getEmployeesByOrganization(@PathVariable Long organizationId) {
        try {
            List<EmployeeResponseDTO> employees = employeeService.getAllEmployeesByOrganization(organizationId);
            return ResponseEntity.ok(employees);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PostMapping("/capitalize-data")
    public ResponseEntity<?> capitalizeEmployeeData(@RequestParam Long organizationId) {
        try {
            int updatedCount = employeeService.capitalizeEmployeeData(organizationId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Employee data capitalized successfully");
            response.put("updatedCount", updatedCount);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateEmployeeStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        try {
            EmployeeResponseDTO response = employeeService.updateEmployeeStatus(id, status);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    // ============== EMPLOYEE EXIT ENDPOINTS ==============

    @PostMapping("/{id}/initiate-exit")
    public ResponseEntity<?> initiateExit(
            @PathVariable Long id,
            @RequestBody EmployeeExitDTO exitDTO,
            @RequestHeader(value = "X-User-ID", required = false) Long userId) {
        try {
            Long initiatedBy = userId != null ? userId : 1L;
            EmployeeResponseDTO response = employeeService.initiateExit(id, exitDTO, initiatedBy);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PostMapping("/{id}/calculate-settlement")
    public ResponseEntity<?> calculateFinalSettlement(@PathVariable Long id) {
        try {
            FinalSettlementDTO response = employeeService.calculateFinalSettlement(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/{id}/settlement")
    public ResponseEntity<?> getFinalSettlement(@PathVariable Long id) {
        try {
            FinalSettlementDTO response = employeeService.getFinalSettlement(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @PostMapping("/settlements/{settlementId}/approve")
    public ResponseEntity<?> approveSettlement(
            @PathVariable Long settlementId,
            @RequestHeader(value = "X-User-ID", required = false) Long userId) {
        try {
            Long approvedBy = userId != null ? userId : 1L;
            FinalSettlementDTO response = employeeService.approveFinalSettlement(settlementId, approvedBy);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PostMapping("/settlements/{settlementId}/mark-paid")
    public ResponseEntity<?> markSettlementPaid(
            @PathVariable Long settlementId,
            @RequestParam(required = false) String paymentReference) {
        try {
            FinalSettlementDTO response = employeeService.markSettlementPaid(settlementId, paymentReference);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/settlements")
    public ResponseEntity<?> getAllSettlements(@RequestParam Long organizationId) {
        try {
            List<FinalSettlementDTO> settlements = employeeService.getAllSettlementsByOrganization(organizationId);
            return ResponseEntity.ok(settlements);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
}
