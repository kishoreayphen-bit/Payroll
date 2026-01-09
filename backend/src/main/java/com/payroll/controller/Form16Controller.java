package com.payroll.controller;

import com.payroll.service.Form16Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/form16")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class Form16Controller {

    private final Form16Service form16Service;

    @GetMapping("/data/{employeeId}")
    public ResponseEntity<Map<String, Object>> getForm16Data(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @PathVariable Long employeeId,
            @RequestParam String financialYear) {
        log.info("Getting Form 16 data for employee: {}, FY: {}", employeeId, financialYear);
        return ResponseEntity.ok(form16Service.getForm16Data(employeeId, financialYear, tenantId));
    }

    @GetMapping("/generate/{employeeId}")
    public ResponseEntity<byte[]> generateForm16(
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @PathVariable Long employeeId,
            @RequestParam String financialYear) {
        log.info("Generating Form 16 PDF for employee: {}, FY: {}", employeeId, financialYear);
        
        try {
            byte[] pdfData = form16Service.generateForm16(employeeId, financialYear, tenantId);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", 
                String.format("form16_%d_%s.pdf", employeeId, financialYear));
            
            return ResponseEntity.ok().headers(headers).body(pdfData);
        } catch (Exception e) {
            log.error("Error generating Form 16", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
