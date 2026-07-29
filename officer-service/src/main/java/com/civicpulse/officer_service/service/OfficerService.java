package com.civicpulse.officer_service.service;

import com.civicpulse.officer_service.dto.RegisterRequest;
import com.civicpulse.officer_service.entity.Officer;
import com.civicpulse.officer_service.repository.OfficerRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class OfficerService {

    private final OfficerRepository repository;
    private final RestTemplate restTemplate;

    public OfficerService(OfficerRepository repository,
                          RestTemplate restTemplate) {
        this.repository = repository;
        this.restTemplate = restTemplate;
    }

    // Generate Officer ID
    private String generateOfficerId() {
        long count = repository.count() + 1;
        return "OFF" + String.format("%04d", count);
    }

    // Register Officer
    public Officer saveOfficer(Officer officer) {

        if (repository.existsByEmail(officer.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (repository.existsByPhone(officer.getPhone())) {
            throw new RuntimeException("Phone already exists");
        }

        officer.setOfficerId(generateOfficerId());
        officer.setActive(true);

        // Save Officer
        Officer savedOfficer = repository.save(officer);

        // Create Login Account in User Service
        RegisterRequest request = new RegisterRequest();
        request.setFullName(savedOfficer.getFullName());
        request.setEmail(savedOfficer.getEmail());
        request.setPassword(savedOfficer.getPassword());
        request.setRole("OFFICER");

        restTemplate.postForObject(
                "http://localhost:8083/auth/register",
                request,
                Object.class
        );

        return savedOfficer;
    }

    // Get All Officers
    public List<Officer> getAllOfficers() {
        return repository.findAll();
    }

    // Get Officer By Database ID
    public Officer getOfficer(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Officer not found"));
    }

    // Get Officer By Officer ID
    public Officer getOfficerByOfficerId(String officerId) {
        return repository.findByOfficerId(officerId)
                .orElseThrow(() ->
                        new RuntimeException("Officer not found"));
    }

    // Delete Officer
    public void deleteOfficer(Long id) {
        repository.deleteById(id);
    }

    // Dashboard Count
    public long getTotalOfficers() {
        return repository.count();
    }

    // Get Officers By Department
    public List<Officer> getOfficersByDepartment(String department) {
        return repository.findByDepartment(department);
    }

    // Get Officers By Department & Designation
    public List<Officer> getOfficersByDepartmentAndDesignation(
            String department,
            String designation) {

        return repository.findByDepartmentAndDesignation(
                department,
                designation
        );
    }

    // Count Officers In Department
    public long getDepartmentOfficerCount(String department) {
        return repository.countByDepartment(department);
    }

    // Update Officer
    public Officer updateOfficer(Long id, Officer updatedOfficer) {

        Officer officer = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Officer not found"));

        officer.setFullName(updatedOfficer.getFullName());
        officer.setEmail(updatedOfficer.getEmail());
        officer.setPhone(updatedOfficer.getPhone());
        officer.setDepartment(updatedOfficer.getDepartment());
        officer.setDesignation(updatedOfficer.getDesignation());

        // Update password if provided
        if (updatedOfficer.getPassword() != null &&
                !updatedOfficer.getPassword().isBlank()) {
            officer.setPassword(updatedOfficer.getPassword());
        }

        officer.setActive(updatedOfficer.isActive());

        return repository.save(officer);
    }
}