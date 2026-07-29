package com.civicpulse.certificateservice.service;

import com.civicpulse.certificateservice.dto.CertificateRequest;
import com.civicpulse.certificateservice.dto.CertificateResponse;

import java.util.List;
import org.springframework.http.ResponseEntity;
public interface CertificateService {

    CertificateResponse generateCertificate(CertificateRequest request);

    CertificateResponse getCertificateById(Long id);

    CertificateResponse getCertificateByApplicationId(Long applicationId);

    List<CertificateResponse> getAllCertificates();
ResponseEntity<byte[]> downloadCertificate(Long id) throws Exception;
    void deleteCertificate(Long id);
    CertificateResponse getCertificateByCertificateNumber(
        String certificateNumber);
        long getCertificateCount();
        List<CertificateResponse> getCertificatesByCitizenId(Long citizenId);
ResponseEntity<byte[]> previewCertificate(Long applicationId) throws Exception;
    }