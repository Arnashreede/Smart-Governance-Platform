package com.civicpulse.certificateservice.controller;

import com.civicpulse.certificateservice.dto.CertificateRequest;
import com.civicpulse.certificateservice.dto.CertificateResponse;
import com.civicpulse.certificateservice.service.CertificateService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/certificates")

public class CertificateController {

    private final CertificateService certificateService;

    public CertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
        System.out.println("***** CertificateController Loaded *****");
    }

    @PostMapping
    public ResponseEntity<CertificateResponse> generateCertificate(
            @RequestBody CertificateRequest request) {

        return ResponseEntity.ok(
                certificateService.generateCertificate(request));
    }

    @GetMapping
    public ResponseEntity<List<CertificateResponse>> getAllCertificates() {

        return ResponseEntity.ok(
                certificateService.getAllCertificates());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getCertificateCount() {

        return ResponseEntity.ok(
                certificateService.getCertificateCount());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CertificateResponse> getCertificate(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                certificateService.getCertificateById(id));
    }

    @GetMapping("/application/{applicationId}")
    public ResponseEntity<CertificateResponse> getByApplicationId(
            @PathVariable Long applicationId) {

        return ResponseEntity.ok(
                certificateService.getCertificateByApplicationId(applicationId));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadCertificate(
            @PathVariable Long id) throws Exception {

        return certificateService.downloadCertificate(id);
    }

    @GetMapping("/verify/{certificateNumber}")
    public CertificateResponse verifyCertificate(
            @PathVariable String certificateNumber) {

        return certificateService.getCertificateByCertificateNumber(
                certificateNumber);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCertificate(
            @PathVariable Long id) {

        certificateService.deleteCertificate(id);

        return ResponseEntity.ok("Certificate deleted successfully.");
    }
    @GetMapping("/citizen/{citizenId}")
public ResponseEntity<List<CertificateResponse>> getCertificatesByCitizen(
        @PathVariable Long citizenId) {

    return ResponseEntity.ok(
            certificateService.getCertificatesByCitizenId(citizenId));
}
@GetMapping("/{id}/preview")
public ResponseEntity<byte[]> previewCertificate(
        @PathVariable Long id) throws Exception {

    return certificateService.previewCertificate(id);
}
}