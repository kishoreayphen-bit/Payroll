package com.payroll.controller;

import com.payroll.dto.PFConfigurationDTO;
import com.payroll.service.PFConfigurationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pf-configuration") // Standard API prefix, assuming app uses /api/ or similar
@CrossOrigin(origins = "*") // For development
@RequiredArgsConstructor
public class PFConfigurationController {

    private final PFConfigurationService pfConfigurationService;

    @GetMapping
    public ResponseEntity<PFConfigurationDTO> getConfiguration(@RequestParam Long organizationId) {
        return ResponseEntity.ok(pfConfigurationService.getConfiguration(organizationId));
    }

    @PostMapping
    public ResponseEntity<PFConfigurationDTO> saveConfiguration(
            @RequestParam Long organizationId,
            @RequestBody PFConfigurationDTO dto) {
        return ResponseEntity.ok(pfConfigurationService.saveConfiguration(organizationId, dto));
    }
}
