package com.payroll.controller;

import com.payroll.service.BankFileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/bank-files")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class BankFileController {

    private final BankFileService bankFileService;

    @GetMapping("/summary/{payRunId}")
    public ResponseEntity<Map<String, Object>> getBankFileSummary(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @PathVariable Long payRunId) {
        log.info("Getting bank file summary for pay run: {}", payRunId);
        return ResponseEntity.ok(bankFileService.getBankFileSummary(payRunId, tenantId));
    }

    @GetMapping("/generate/{payRunId}")
    public ResponseEntity<byte[]> generateBankFile(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @PathVariable Long payRunId,
            @RequestParam(defaultValue = "NEFT") String type) {
        log.info("Generating {} bank file for pay run: {}", type, payRunId);
        
        byte[] fileData = bankFileService.generateBankPaymentFile(payRunId, tenantId, type);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        headers.setContentDispositionFormData("attachment", 
            String.format("bank_payment_%s_%d.txt", type.toLowerCase(), payRunId));
        
        return ResponseEntity.ok().headers(headers).body(fileData);
    }

    @GetMapping("/generate/hdfc/{payRunId}")
    public ResponseEntity<byte[]> generateHDFCBankFile(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @PathVariable Long payRunId) {
        log.info("Generating HDFC bank file for pay run: {}", payRunId);
        
        byte[] fileData = bankFileService.generateHDFCBankFile(payRunId, tenantId);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", 
            String.format("hdfc_payment_%d.csv", payRunId));
        
        return ResponseEntity.ok().headers(headers).body(fileData);
    }

    @GetMapping("/generate/icici/{payRunId}")
    public ResponseEntity<byte[]> generateICICIBankFile(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @PathVariable Long payRunId) {
        log.info("Generating ICICI bank file for pay run: {}", payRunId);
        
        byte[] fileData = bankFileService.generateICICIBankFile(payRunId, tenantId);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", 
            String.format("icici_payment_%d.csv", payRunId));
        
        return ResponseEntity.ok().headers(headers).body(fileData);
    }
}
