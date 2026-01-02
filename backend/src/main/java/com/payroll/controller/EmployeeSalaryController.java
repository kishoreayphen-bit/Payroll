package com.payroll.controller;

import com.payroll.dto.EmployeeSalaryComponentDTO;
import com.payroll.dto.SalaryBreakdownDTO;
import com.payroll.service.EmployeeSalaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EmployeeSalaryController {

    private final EmployeeSalaryService employeeSalaryService;

    // Get all salary components for an employee
    @GetMapping("/employees/{employeeId}/salary-components")
    public ResponseEntity<List<EmployeeSalaryComponentDTO>> getEmployeeComponents(
            @PathVariable Long employeeId) {
        List<EmployeeSalaryComponentDTO> components = employeeSalaryService.getEmployeeComponents(employeeId);
        return ResponseEntity.ok(components);
    }

    // Get salary components for an employee on a specific date
    @GetMapping("/employees/{employeeId}/salary-components/on-date")
    public ResponseEntity<List<EmployeeSalaryComponentDTO>> getEmployeeComponentsOnDate(
            @PathVariable Long employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<EmployeeSalaryComponentDTO> components = employeeSalaryService.getEmployeeComponentsOnDate(employeeId,
                date);
        return ResponseEntity.ok(components);
    }

    // Assign a salary component to an employee
    @PostMapping("/employees/{employeeId}/salary-components")
    public ResponseEntity<EmployeeSalaryComponentDTO> assignComponentToEmployee(
            @PathVariable Long employeeId,
            @RequestBody EmployeeSalaryComponentDTO componentDTO) {
        try {
            componentDTO.setEmployeeId(employeeId);
            EmployeeSalaryComponentDTO assigned = employeeSalaryService.assignComponentToEmployee(componentDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(assigned);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Update an employee's salary component assignment
    @PutMapping("/employee-salary-components/{id}")
    public ResponseEntity<EmployeeSalaryComponentDTO> updateEmployeeComponent(
            @PathVariable Long id,
            @RequestBody EmployeeSalaryComponentDTO componentDTO) {
        try {
            EmployeeSalaryComponentDTO updated = employeeSalaryService.updateEmployeeComponent(id, componentDTO);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Remove a salary component from an employee
    @DeleteMapping("/employee-salary-components/{id}")
    public ResponseEntity<Void> removeComponentFromEmployee(@PathVariable Long id) {
        try {
            employeeSalaryService.removeComponentFromEmployee(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Get detailed salary breakdown for an employee
    @GetMapping("/employees/{employeeId}/salary-breakdown")
    public ResponseEntity<SalaryBreakdownDTO> getSalaryBreakdown(
            @PathVariable Long employeeId) {
        try {
            SalaryBreakdownDTO breakdown = employeeSalaryService.calculateSalaryBreakdown(employeeId);
            return ResponseEntity.ok(breakdown);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
