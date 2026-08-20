package com.civicpulse.grievance_service.repository;

import com.civicpulse.grievance_service.entity.Grievance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GrievanceRepository extends JpaRepository<Grievance, Long> {

    // Citizen Grievances
    List<Grievance> findByCitizenId(Long citizenId);
List<Grievance> findByAssignedOfficerId(Long officerId);
    // Dashboard Counts
    long countByStatus(String status);

    long countByStatusIgnoreCase(String status);
long countByEscalatedTrue();
    // Active Grievance Validation
    List<Grievance> findByCitizenIdAndStatusIn(
            Long citizenId,
            List<String> statuses
    );

    boolean existsByCitizenIdAndStatusIn(
            Long citizenId,
            List<String> statuses
    );

    // Department Filtering
    List<Grievance> findByDepartment(String department);

    List<Grievance> findByDepartmentAndStatus(
            String department,
            String status
    );

    // Priority Filtering
    List<Grievance> findByPriority(String priority);

    // Status Filtering
    List<Grievance> findByStatus(String status);

}