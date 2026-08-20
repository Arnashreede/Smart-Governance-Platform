package com.civicpulse.grievance_service.repository;

import com.civicpulse.grievance_service.entity.GrievanceHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GrievanceHistoryRepository
        extends JpaRepository<GrievanceHistory, Long> {

    List<GrievanceHistory> findByGrievanceIdOrderByUpdatedAtAsc(
            Long grievanceId
    );
}