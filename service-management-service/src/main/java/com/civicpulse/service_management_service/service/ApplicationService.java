package com.civicpulse.service_management_service.service;

import com.civicpulse.service_management_service.entity.Application;
import com.civicpulse.service_management_service.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.civicpulse.service_management_service.dto.CertificateRequest;
import com.civicpulse.service_management_service.dto.CertificateResponse;
import com.civicpulse.service_management_service.entity.Document;
import com.civicpulse.service_management_service.repository.DocumentRepository;
import java.util.List;
import java.time.LocalDate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import org.springframework.core.io.Resource;
import java.util.Optional;
import org.springframework.web.client.RestTemplate;
@Service
public class ApplicationService {
@Autowired
private RestTemplate restTemplate;
@Autowired
private DocumentRepository documentRepository;
    @Autowired
    private ApplicationRepository applicationRepository;
    @Value("${file.upload-dir}")
private String uploadDir;

    // Submit a new application
    public Application submitApplication(Application application) {

    List<String> activeStatuses = List.of(
            "SUBMITTED",
            "VERIFIED",
            "APPROVED"
    );

    Optional<Application> existing =
            applicationRepository.findByCitizenIdAndApplicationTypeAndStatusIn(
                    application.getCitizenId(),
                    application.getApplicationType(),
                    activeStatuses
            );

    if (existing.isPresent()) {
        throw new RuntimeException(
                "You have already applied for a "
                        + application.getApplicationType()
                        + ". Please wait until it is approved or rejected.");
    }

    application.setStatus("SUBMITTED");

    return applicationRepository.save(application);
}

    // Get all applications
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    // Get application by ID
    public Application getApplicationById(Long id) {

        return applicationRepository.findById(id).orElse(null);
    }

    // Get applications of one citizen
    public List<Application> getCitizenApplications(Long citizenId) {

        return applicationRepository.findByCitizenId(citizenId);
    }
public List<Application> getApplicationsByStatus(String status) {

    return applicationRepository.findByStatus(status);
}

public List<Application> getApplicationsByType(String applicationType) {

    return applicationRepository.findByApplicationType(applicationType);
}
 public List<Document> getDocuments(Long applicationId) {

    return documentRepository.findByApplicationId(applicationId);

}   
   
public Application approveApplication(Long id) {

    System.out.println("Approve application called for ID: " + id);

    Application application = applicationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Application not found"));

    if (!"VERIFIED".equals(application.getStatus())) {
        throw new RuntimeException("Application must be verified before approval.");
    }

    // Create request for certificate-service
    CertificateRequest request = new CertificateRequest();

    request.setApplicationId(application.getId());
    request.setCitizenId(application.getCitizenId());
    request.setCitizenName(application.getApplicantName());
    request.setServiceName(application.getApplicationType());
    request.setDepartmentName("Municipal Department");
    request.setOfficerName("Municipal Officer");
    request.setOfficerId("OFFICER-001");
    request.setApplicationDate(LocalDate.now());
    request.setApprovalDate(LocalDate.now());
    request.setValidTill(LocalDate.now().plusYears(1));

    try {

        System.out.println("Calling certificate-service...");

        CertificateResponse response =
                restTemplate.postForObject(
                        "http://localhost:8089/certificates",
                        request,
                        CertificateResponse.class
                );

        if (response == null) {
            throw new RuntimeException("Certificate service returned null response.");
        }

        // Update application only after certificate is created
        application.setStatus("APPROVED");
        application.setApprovedBy("Municipal Officer");
        application.setApprovedDate(LocalDate.now());
        application.setRemarks("Application Approved");
        application.setCertificateNumber(response.getCertificateNumber());

        applicationRepository.save(application);

        System.out.println("Certificate created successfully.");

    } catch (Exception e) {

        System.out.println("Certificate generation failed: " + e.getMessage());
        e.printStackTrace();

        throw new RuntimeException("Certificate generation failed", e);
    }

    return application;
}
// Reject application
public Application rejectApplication(Long id, String reason) {

    Application application = applicationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Application not found"));

    application.setStatus("REJECTED");
    application.setRejectionReason(reason);
    application.setRemarks(reason);

    return applicationRepository.save(application);
}
    // Delete application
    public void deleteApplication(Long id) {
        applicationRepository.deleteById(id);
    }
    public Application verifyApplication(Long id) {

    Application application = applicationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Application not found"));

    application.setStatus("VERIFIED");
    application.setRemarks("Documents verified successfully");

    return applicationRepository.save(application);
}
public Application uploadDocument(Long id, MultipartFile file) throws IOException {

    Application application = applicationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Application not found"));

    Path uploadPath = Paths.get(uploadDir);

    if (!Files.exists(uploadPath)) {
        Files.createDirectories(uploadPath);
    }

    String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

    Path filePath = uploadPath.resolve(fileName);

    Files.copy(
            file.getInputStream(),
            filePath,
            StandardCopyOption.REPLACE_EXISTING
    );

    Document document = new Document();

    document.setApplication(application);
    document.setDocumentName(file.getOriginalFilename());
    document.setDocumentType(file.getContentType());
    document.setDocumentPath(filePath.toString());

    documentRepository.save(document);

    return application;
}
public Resource getDocument(Long documentId) throws IOException {

    Document document = documentRepository.findById(documentId)
            .orElseThrow(() -> new RuntimeException("Document not found"));

    Path path = Paths.get(document.getDocumentPath());

    return new UrlResource(path.toUri());
}
}