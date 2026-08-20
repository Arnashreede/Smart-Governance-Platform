package com.civicpulse.officer_service.service;

import com.civicpulse.officer_service.entity.Assignment;
import com.civicpulse.officer_service.entity.Officer;
import com.civicpulse.officer_service.enums.AssignmentStatus;
import com.civicpulse.officer_service.enums.ModuleType;
import com.civicpulse.officer_service.repository.AssignmentRepository;
import com.civicpulse.officer_service.repository.OfficerRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final OfficerRepository officerRepository;

    public AssignmentService(AssignmentRepository assignmentRepository,
                             OfficerRepository officerRepository) {
        this.assignmentRepository = assignmentRepository;
        this.officerRepository = officerRepository;
    }

    // Assign Task
    public Assignment assignTask(Assignment assignment) {

        Officer officer = officerRepository.findById(assignment.getOfficerId())
                .orElseThrow(() -> new RuntimeException("Officer not found"));

        assignment.setOfficerName(officer.getFullName());
        assignment.setDepartment(officer.getDepartment());

        assignment.setAssignedAt(LocalDateTime.now());

        if (assignment.getStatus() == null) {
            assignment.setStatus(AssignmentStatus.ASSIGNED);
        }

        return assignmentRepository.save(assignment);
    }

    // Get All Assignments
    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    // Get Assignment By ID
    public Assignment getAssignment(Long id) {

        return assignmentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Assignment not found"));
    }

    // Officer Tasks
    public List<Assignment> getOfficerAssignments(Long officerId) {

        return assignmentRepository.findByOfficerId(officerId);
    }

    // Department Tasks
    public List<Assignment> getDepartmentAssignments(String department) {

        return assignmentRepository.findByDepartment(department);
    }

    // Module Tasks
    public List<Assignment> getModuleAssignments(ModuleType moduleType) {

        return assignmentRepository.findByModuleType(moduleType);
    }

    // Tasks By Status
    public List<Assignment> getAssignmentsByStatus(
            AssignmentStatus status) {

        return assignmentRepository.findByStatus(status);
    }

    // Update Assignment Status
    public Assignment updateStatus(
            Long id,
            AssignmentStatus status) {

        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Assignment not found"));

        assignment.setStatus(status);

        if (status == AssignmentStatus.COMPLETED) {
            assignment.setCompletedAt(LocalDateTime.now());
        }

        return assignmentRepository.save(assignment);
    }

    // Delete Assignment
    public void deleteAssignment(Long id) {

        if (!assignmentRepository.existsById(id)) {
            throw new RuntimeException("Assignment not found");
        }

        assignmentRepository.deleteById(id);
    }

    // Dashboard Count
    public long getTotalAssignments() {
        return assignmentRepository.count();
    }

    // Officer Dashboard Count
    public long getOfficerAssignmentCount(Long officerId) {
        return assignmentRepository.countByOfficerId(officerId);
    }

    // Completed Count
    public long getCompletedAssignments() {
        return assignmentRepository.countByStatus(AssignmentStatus.COMPLETED);
    }

    // Pending Count
    public long getPendingAssignments() {
        return assignmentRepository.countByStatus(AssignmentStatus.ASSIGNED);
    }
}