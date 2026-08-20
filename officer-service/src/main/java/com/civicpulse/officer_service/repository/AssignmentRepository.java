package com.civicpulse.officer_service.repository;

import com.civicpulse.officer_service.entity.Assignment;
import com.civicpulse.officer_service.enums.AssignmentStatus;
import com.civicpulse.officer_service.enums.ModuleType;
import com.civicpulse.officer_service.enums.Priority;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    List<Assignment> findByOfficerId(Long officerId);

    List<Assignment> findByDepartment(String department);

    List<Assignment> findByModuleType(ModuleType moduleType);

    List<Assignment> findByPriority(Priority priority);

    List<Assignment> findByStatus(AssignmentStatus status);

    List<Assignment> findByOfficerIdAndStatus(
            Long officerId,
            AssignmentStatus status
    );

    List<Assignment> findByDepartmentAndStatus(
            String department,
            AssignmentStatus status
    );

    List<Assignment> findByOfficerIdAndModuleType(
            Long officerId,
            ModuleType moduleType
    );

    long countByOfficerId(Long officerId);

    long countByStatus(AssignmentStatus status);

}