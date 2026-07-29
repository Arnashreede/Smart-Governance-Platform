package com.civicpulse.grievance_service.controller;

import com.civicpulse.grievance_service.dto.AssignOfficerRequest;
import com.civicpulse.grievance_service.dto.DashboardCounts;
import com.civicpulse.grievance_service.dto.UpdateRemarksRequest;
import com.civicpulse.grievance_service.dto.UpdateStatusRequest;
import com.civicpulse.grievance_service.entity.Grievance;
import com.civicpulse.grievance_service.service.GrievanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/grievances")

public class GrievanceController {

    @Autowired
    private GrievanceService grievanceService;

    @PostMapping
    public Grievance addGrievance(@RequestBody Grievance grievance) {
        return grievanceService.saveGrievance(grievance);
    }

    @GetMapping
    public List<Grievance> getAllGrievances() {
        return grievanceService.getAllGrievances();
    }

    @GetMapping("/dashboard/counts")
    public DashboardCounts getDashboardCounts() {
        return grievanceService.getDashboardCounts();
    }

    @GetMapping("/officer/{name}")
    public List<Grievance> getOfficerGrievances(@PathVariable String name) {
        return grievanceService.getOfficerGrievances(name);
    }

    @GetMapping("/citizen/{citizenId}")
    public List<Grievance> getCitizenGrievances(@PathVariable Long citizenId) {
        return grievanceService.getCitizenGrievances(citizenId);
    }

    @GetMapping("/{id}")
    public Grievance getGrievance(@PathVariable Long id) {
        return grievanceService.getGrievanceById(id);
    }

    @PutMapping("/{id}/assign")
    public Grievance assignOfficer(
            @PathVariable Long id,
            @RequestBody AssignOfficerRequest request) {

        return grievanceService.assignOfficer(id, request);
    }

    @PutMapping("/{id}/status")
    public Grievance updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateStatusRequest request) {

        return grievanceService.updateStatus(id, request.getStatus());
    }

    @PutMapping("/{id}/remarks")
    public Grievance updateRemarks(
            @PathVariable Long id,
            @RequestBody UpdateRemarksRequest request) {

        return grievanceService.updateRemarks(id, request.getRemarks());
    }

    @DeleteMapping("/{id}")
    public String deleteGrievance(@PathVariable Long id) {

        grievanceService.deleteGrievance(id);

        return "Grievance deleted successfully";
    }
}