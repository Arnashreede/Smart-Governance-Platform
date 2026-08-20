package com.civicpulse.service_management_service.controller;

import com.civicpulse.service_management_service.entity.Application;
import com.civicpulse.service_management_service.entity.Document;
import com.civicpulse.service_management_service.service.ApplicationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/applications")
@CrossOrigin(origins = "http://localhost:5173")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @PostMapping
    public Application submitApplication(@RequestBody Application application) {
        return applicationService.submitApplication(application);
    }

    @GetMapping
    public List<Application> getAllApplications() {
        return applicationService.getAllApplications();
    }

    @GetMapping("/{id}")
    public Application getApplication(@PathVariable Long id) {
        return applicationService.getApplicationById(id);
    }

    @GetMapping("/citizen/{citizenId}")
    public List<Application> getCitizenApplications(@PathVariable Long citizenId) {
        return applicationService.getCitizenApplications(citizenId);
    }

    @PutMapping("/{id}/approve")
    public Application approveApplication(@PathVariable Long id) {
        return applicationService.approveApplication(id);
    }

    @PutMapping("/{id}/verify")
    public Application verifyApplication(@PathVariable Long id) {
        return applicationService.verifyApplication(id);
    }

    @PutMapping("/{id}/reject")
    public Application rejectApplication(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        return applicationService.rejectApplication(id, body.get("remarks"));
    }

    @DeleteMapping("/{id}")
    public String deleteApplication(@PathVariable Long id) {
        applicationService.deleteApplication(id);
        return "Application deleted successfully";
    }

    @GetMapping("/{id}/certificate")
    public Application getCertificate(@PathVariable Long id) {
        return applicationService.getApplicationById(id);
    }

    @GetMapping("/status/{status}")
    public List<Application> getApplicationsByStatus(@PathVariable String status) {
        return applicationService.getApplicationsByStatus(status);
    }

    @GetMapping("/type/{type}")
    public List<Application> getApplicationsByType(@PathVariable String type) {
        return applicationService.getApplicationsByType(type);
    }

    @PostMapping("/{id}/upload")
    public ResponseEntity<Application> uploadDocument(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {

        Application application = applicationService.uploadDocument(id, file);
        return ResponseEntity.ok(application);
    }

    @GetMapping("/document/{documentId}")
    public ResponseEntity<Resource> viewDocument(@PathVariable Long documentId) throws IOException {

        Resource resource = applicationService.getDocument(documentId);

        String contentType = "application/octet-stream";

        if (resource.getFilename() != null) {
            String name = resource.getFilename().toLowerCase();

            if (name.endsWith(".pdf")) {
                contentType = "application/pdf";
            } else if (name.endsWith(".jpg") || name.endsWith(".jpeg")) {
                contentType = "image/jpeg";
            } else if (name.endsWith(".png")) {
                contentType = "image/png";
            }
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @GetMapping("/{id}/documents")
    public List<Document> getDocuments(@PathVariable Long id) {
        return applicationService.getDocuments(id);
    }
}