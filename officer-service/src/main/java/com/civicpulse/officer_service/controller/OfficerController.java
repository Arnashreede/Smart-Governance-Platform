package com.civicpulse.officer_service.controller;

import com.civicpulse.officer_service.entity.Officer;
import com.civicpulse.officer_service.service.OfficerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/officers")
public class OfficerController {

    private final OfficerService officerService;

    public OfficerController(OfficerService officerService) {
        this.officerService = officerService;
    }

    @PostMapping
    public Officer saveOfficer(@RequestBody Officer officer) {
        return officerService.saveOfficer(officer);
    }

    @GetMapping
    public List<Officer> getAllOfficers() {
        return officerService.getAllOfficers();
    }

    @GetMapping("/{id}")
    public Officer getOfficer(@PathVariable Long id) {
        return officerService.getOfficer(id);
    }
    @GetMapping("/officerId/{officerId}")
public Officer getOfficerByOfficerId(
        @PathVariable String officerId) {

    return officerService.getOfficerByOfficerId(officerId);

}

    @DeleteMapping("/{id}")
    public String deleteOfficer(@PathVariable Long id) {
        officerService.deleteOfficer(id);
        return "Officer Deleted Successfully";
    }
@GetMapping("/dashboard/count")
public long getTotalOfficers() {
    return officerService.getTotalOfficers();
}
@GetMapping("/department/{department}")
public List<Officer> getOfficersByDepartment(
        @PathVariable String department) {

    return officerService.getOfficersByDepartment(department);
}

@GetMapping("/department/{department}/{designation}")
public List<Officer> getOfficersByDepartmentAndDesignation(
        @PathVariable String department,
        @PathVariable String designation) {

    return officerService.getOfficersByDepartmentAndDesignation(
            department,
            designation
    );
}

@PutMapping("/{id}")
public Officer updateOfficer(
        @PathVariable Long id,
        @RequestBody Officer officer) {

    return officerService.updateOfficer(id, officer);
}

}