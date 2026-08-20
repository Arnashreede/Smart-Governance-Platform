package com.civicpulse.officer_service.controller;

import com.civicpulse.officer_service.entity.Assignment;
import com.civicpulse.officer_service.enums.AssignmentStatus;
import com.civicpulse.officer_service.enums.ModuleType;
import com.civicpulse.officer_service.service.AssignmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/assignments")
@CrossOrigin(origins = "http://localhost:5173")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    // Admin Assign Task
    @PostMapping
    public Assignment assignTask(@RequestBody Assignment assignment) {
        return assignmentService.assignTask(assignment);
    }

    // Get All Assignments
    @GetMapping
    public List<Assignment> getAllAssignments() {
        return assignmentService.getAllAssignments();
    }

    // Get Assignment By ID
    @GetMapping("/{id}")
    public Assignment getAssignment(@PathVariable Long id) {
        return assignmentService.getAssignment(id);
    }

    // Get Assignments of an Officer
    @GetMapping("/officer/{officerId}")
    public List<Assignment> getOfficerAssignments(
            @PathVariable Long officerId) {

        return assignmentService.getOfficerAssignments(officerId);
    }

    // Get Assignments of Department
    @GetMapping("/department/{department}")
    public List<Assignment> getDepartmentAssignments(
            @PathVariable String department) {

        return assignmentService.getDepartmentAssignments(department);
    }

    // Get Module Assignments
    @GetMapping("/module/{moduleType}")
    public List<Assignment> getModuleAssignments(
            @PathVariable ModuleType moduleType) {

        return assignmentService.getModuleAssignments(moduleType);
    }

    // Get Assignments By Status
    @GetMapping("/status/{status}")
    public List<Assignment> getAssignmentsByStatus(
            @PathVariable AssignmentStatus status) {

        return assignmentService.getAssignmentsByStatus(status);
    }

    // Update Assignment Status
    @PutMapping("/{id}/status/{status}")
    public Assignment updateAssignmentStatus(
            @PathVariable Long id,
            @PathVariable AssignmentStatus status) {

        return assignmentService.updateStatus(id, status);
    }

    // Dashboard Counts
    @GetMapping("/dashboard/total")
    public long getTotalAssignments() {
        return assignmentService.getTotalAssignments();
    }

    @GetMapping("/dashboard/completed")
    public long getCompletedAssignments() {
        return assignmentService.getCompletedAssignments();
    }

    @GetMapping("/dashboard/pending")
    public long getPendingAssignments() {
        return assignmentService.getPendingAssignments();
    }

    @GetMapping("/dashboard/officer/{officerId}")
    public long getOfficerAssignmentCount(
            @PathVariable Long officerId) {

        return assignmentService.getOfficerAssignmentCount(officerId);
    }

    // Delete Assignment
    @DeleteMapping("/{id}")
    public String deleteAssignment(@PathVariable Long id) {

        assignmentService.deleteAssignment(id);

        return "Assignment deleted successfully.";
    }
}