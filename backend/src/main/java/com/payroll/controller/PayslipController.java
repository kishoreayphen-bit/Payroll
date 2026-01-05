package com.payroll.controller;

import com.payroll.dto.PayslipDTO;
import com.payroll.service.PayslipService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payslips")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class PayslipController {

    private final PayslipService payslipService;

    @PostMapping("/generate/{payRunId}")
    public ResponseEntity<List<PayslipDTO>> generatePayslips(
            @PathVariable Long payRunId,
            @RequestHeader("X-Tenant-ID") Long tenantId) {
        log.info("Generating payslips for pay run: {}", payRunId);
        List<PayslipDTO> payslips = payslipService.generatePayslips(payRunId, tenantId);
        return ResponseEntity.ok(payslips);
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<PayslipDTO>> getEmployeePayslips(
            @PathVariable Long employeeId) {
        log.info("Getting payslips for employee: {}", employeeId);
        List<PayslipDTO> payslips = payslipService.getEmployeePayslips(employeeId);
        return ResponseEntity.ok(payslips);
    }

    @GetMapping("/employee/{employeeId}/year/{year}")
    public ResponseEntity<List<PayslipDTO>> getEmployeePayslipsByYear(
            @PathVariable Long employeeId,
            @PathVariable int year) {
        log.info("Getting payslips for employee: {} year: {}", employeeId, year);
        List<PayslipDTO> payslips = payslipService.getEmployeePayslipsByYear(employeeId, year);
        return ResponseEntity.ok(payslips);
    }

    @GetMapping("/{payslipId}/download")
    public ResponseEntity<byte[]> downloadPayslip(
            @PathVariable Long payslipId,
            @RequestHeader("X-Employee-ID") Long employeeId) {
        log.info("Downloading payslip: {} for employee: {}", payslipId, employeeId);
        byte[] pdfBytes = payslipService.getPayslipPdf(payslipId, employeeId);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "payslip.pdf");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }

    @PostMapping("/{payslipId}/send-email")
    public ResponseEntity<Map<String, String>> sendPayslipEmail(
            @PathVariable Long payslipId,
            @RequestHeader("X-Tenant-ID") Long tenantId) {
        log.info("Sending payslip email: {}", payslipId);
        payslipService.sendPayslipEmail(payslipId, tenantId);
        return ResponseEntity.ok(Map.of("message", "Payslip email sent successfully"));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleException(RuntimeException e) {
        log.error("Error in payslip controller: {}", e.getMessage());
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
}
