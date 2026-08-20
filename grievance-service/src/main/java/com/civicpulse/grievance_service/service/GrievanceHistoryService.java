package com.civicpulse.grievance_service.service;

import com.civicpulse.grievance_service.entity.GrievanceHistory;
import com.civicpulse.grievance_service.repository.GrievanceHistoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GrievanceHistoryService {

    private final GrievanceHistoryRepository repository;

    public GrievanceHistoryService(
            GrievanceHistoryRepository repository) {

        this.repository = repository;
    }

    public GrievanceHistory save(
            GrievanceHistory history) {

        return repository.save(history);
    }

    public List<GrievanceHistory> getHistory(
            Long grievanceId) {

        return repository
                .findByGrievanceIdOrderByUpdatedAtAsc(
                        grievanceId
                );
    }
}