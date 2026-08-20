package com.civicpulse.officer_service.service;

import com.civicpulse.officer_service.dto.RegisterRequest;
import com.civicpulse.officer_service.entity.Officer;
import com.civicpulse.officer_service.enums.OfficerStatus;
import com.civicpulse.officer_service.repository.OfficerRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Year;
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

    // Generate Employee ID
    private String generateEmployeeId() {
        long count = repository.count() + 1;
        return "EMP-" + Year.now().getValue() + "-"
                + String.format("%05d", count);
    }

    // Register Officer
    public Officer saveOfficer(Officer officer) {

        if (repository.existsByEmail(officer.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (repository.existsByPhone(officer.getPhone())) {
            throw new RuntimeException("Phone already exists");
        }

        officer.setEmployeeId(generateEmployeeId());
        officer.setStatus(OfficerStatus.PENDING);
        officer.setActive(true);

        Officer savedOfficer = repository.save(officer);

        RegisterRequest request = new RegisterRequest();

request.setFullName(savedOfficer.getFullName());
request.setEmail(savedOfficer.getEmail());
request.setPhone(savedOfficer.getPhone());
request.setDesignation(savedOfficer.getDesignation());
request.setPassword(savedOfficer.getPassword());
request.setRole("OFFICER");
request.setDepartmentId(savedOfficer.getDepartmentId());



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

    // Get Officer By Employee ID
    public Officer getOfficerByEmployeeId(String employeeId) {
        return repository.findByEmployeeId(employeeId)
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

    // Officers By Department
    public List<Officer> getOfficersByDepartment(String department) {
        return repository.findByDepartment(department);
    }

    // Officers By Department & Designation
    public List<Officer> getOfficersByDepartmentAndDesignation(
            String department,
            String designation) {

        return repository.findByDepartmentAndDesignation(
                department,
                designation
        );
    }

    // Count Officers
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
        officer.setDepartmentId(updatedOfficer.getDepartmentId());
        officer.setDesignation(updatedOfficer.getDesignation());

        if (updatedOfficer.getPassword() != null
                && !updatedOfficer.getPassword().isBlank()) {

            officer.setPassword(updatedOfficer.getPassword());
        }

        officer.setStatus(updatedOfficer.getStatus());
        officer.setActive(updatedOfficer.isActive());

        return repository.save(officer);
    }
    // Get Officers By Status
public List<Officer> getOfficersByStatus(OfficerStatus status) {
    return repository.findByStatus(status);
}
// Approve Officer
public Officer approveOfficer(Long id) {

    Officer officer = repository.findById(id)
            .orElseThrow(() ->
                    new RuntimeException("Officer not found"));

    officer.setStatus(OfficerStatus.ACTIVE);

    return repository.save(officer);
}

// Reject Officer
public Officer rejectOfficer(Long id) {

    Officer officer = repository.findById(id)
            .orElseThrow(() ->
                    new RuntimeException("Officer not found"));

    officer.setStatus(OfficerStatus.REJECTED);

    return repository.save(officer);
}
}