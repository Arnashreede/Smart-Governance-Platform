package com.civicpulse.officer_service.controller;

import com.civicpulse.officer_service.entity.Officer;
import com.civicpulse.officer_service.enums.OfficerStatus;
import com.civicpulse.officer_service.service.OfficerService;
import org.springframework.web.bind.annotation.*;
import com.civicpulse.officer_service.dto.OfficerResponse;
import java.util.List;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/officers")
//@CrossOrigin(origins = "http://localhost:5173")
public class OfficerController {

    private final OfficerService officerService;

    public OfficerController(OfficerService officerService) {
        this.officerService = officerService;
    }

    // Register Officer
   @PostMapping
public OfficerResponse saveOfficer(@RequestBody Officer officer) {
    return toResponse(officerService.saveOfficer(officer));
}

    // Get All Officers
    @GetMapping
public List<OfficerResponse> getAllOfficers() {
    return officerService.getAllOfficers()
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
}

    // Get Officer By Database ID
   @GetMapping("/{id}")
public OfficerResponse getOfficerById(@PathVariable Long id) {
    return toResponse(officerService.getOfficer(id));

}

    // Get Officer By Employee ID
    @GetMapping("/employee/{employeeId}")
public OfficerResponse getOfficerByEmployeeId(
        @PathVariable String employeeId) {

    return toResponse(
            officerService.getOfficerByEmployeeId(employeeId)
    );
}

    // Get Officers By Department
   @GetMapping("/department/{department}")
public List<OfficerResponse> getOfficersByDepartment(
        @PathVariable String department) {

    return officerService.getOfficersByDepartment(department)
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
}

    // Get Officers By Department & Designation
    @GetMapping("/department/{department}/{designation}")
public List<OfficerResponse> getOfficersByDepartmentAndDesignation(
        @PathVariable String department,
        @PathVariable String designation) {

    return officerService
            .getOfficersByDepartmentAndDesignation(department, designation)
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
}

    // Get Officers By Status
   @GetMapping("/status/{status}")
public List<OfficerResponse> getOfficersByStatus(
        @PathVariable OfficerStatus status) {

    return officerService.getOfficersByStatus(status)
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
}

    // Dashboard Count
    @GetMapping("/dashboard/count")
    public long getTotalOfficers() {
        return officerService.getTotalOfficers();
    }

    // Update Officer
    @PutMapping("/{id}")
public OfficerResponse updateOfficer(
        @PathVariable Long id,
        @RequestBody Officer officer) {

    return toResponse(
            officerService.updateOfficer(id, officer)
    );
}

    // Delete Officer
    @DeleteMapping("/{id}")
    public String deleteOfficer(@PathVariable Long id) {

        officerService.deleteOfficer(id);

        return "Officer Deleted Successfully";
    }
    @PutMapping("/{id}/approve")
public OfficerResponse approveOfficer(@PathVariable Long id) {
    return toResponse(
            officerService.approveOfficer(id)
    );
}

@PutMapping("/{id}/reject")
public OfficerResponse rejectOfficer(@PathVariable Long id) {
    return toResponse(
            officerService.rejectOfficer(id)
    );
}
private OfficerResponse toResponse(Officer officer) {
    return new OfficerResponse(
            officer.getId(),
            officer.getEmployeeId(),
            officer.getFullName(),
            officer.getEmail(),
            officer.getPhone(),
            officer.getDepartment(),
            officer.getDepartmentId(),
            officer.getDesignation(),
            officer.getStatus(),
            officer.isActive()
    );
}
}
