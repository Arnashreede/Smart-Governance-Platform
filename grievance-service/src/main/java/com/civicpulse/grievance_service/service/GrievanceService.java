package com.civicpulse.grievance_service.service;

import com.civicpulse.grievance_service.dto.AssignOfficerRequest;
import com.civicpulse.grievance_service.dto.DashboardCounts;
import com.civicpulse.grievance_service.entity.Grievance;
import com.civicpulse.grievance_service.event.GrievanceCreatedEvent;
import com.civicpulse.grievance_service.kafka.GrievanceEventProducer;
import com.civicpulse.grievance_service.repository.GrievanceRepository;
import org.springframework.stereotype.Service;
import com.civicpulse.grievance_service.entity.GrievanceHistory;
import com.civicpulse.grievance_service.service.GrievanceHistoryService;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class GrievanceService {

    private final GrievanceRepository grievanceRepository;
    private final GrievanceEventProducer grievanceEventProducer;
private final GrievanceHistoryService grievanceHistoryService;
   public GrievanceService(
        GrievanceRepository grievanceRepository,
        GrievanceEventProducer grievanceEventProducer,
        GrievanceHistoryService grievanceHistoryService) {

    this.grievanceRepository = grievanceRepository;
    this.grievanceEventProducer = grievanceEventProducer;
    this.grievanceHistoryService = grievanceHistoryService;
}

    // ============================
    // SAVE GRIEVANCE
    // ============================

    public Grievance saveGrievance(Grievance grievance) {

        List<String> activeStatuses = List.of(
                "OPEN",
                "PENDING",
                "IN_PROGRESS"
        );

        boolean exists =
                grievanceRepository.existsByCitizenIdAndStatusIn(
                        grievance.getCitizenId(),
                        activeStatuses
                );

        if (exists) {
            throw new RuntimeException(
                    "You already have an active grievance. Please wait until it is resolved."
            );
        }

        grievance.setStatus("OPEN");
grievance.setCreatedAt(LocalDateTime.now());

grievance.setSlaHours(72);

grievance.setDueDate(
        LocalDateTime.now().plusHours(72)
);

grievance.setEscalated(false);
        if (grievance.getPriority() == null
                || grievance.getPriority().isBlank()) {

            grievance.setPriority("LOW");
        }

        Grievance savedGrievance =
                grievanceRepository.save(grievance);
grievanceHistoryService.save(

        new GrievanceHistory(

                savedGrievance.getId(),
                "-",
                "OPEN",
                "Grievance Submitted",
                "Citizen"

        )
);
        GrievanceCreatedEvent event =
        new GrievanceCreatedEvent(

                savedGrievance.getId(),
                savedGrievance.getCitizenId(),
                savedGrievance.getTitle(),
                savedGrievance.getDepartment(),
                savedGrievance.getCategory(),
                savedGrievance.getStatus(),
                savedGrievance.getPriority()

        );

        grievanceEventProducer.publishGrievanceCreatedEvent(event);

        return savedGrievance;
    }
        // ============================
    // GET ALL GRIEVANCES
    // ============================

    public List<Grievance> getAllGrievances() {
        return grievanceRepository.findAll();
    }

    // ============================
    // GET GRIEVANCE BY ID
    // ============================

    public Grievance getGrievanceById(Long id) {

        return grievanceRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Grievance not found"));
    }

    // ============================
    // GET CITIZEN GRIEVANCES
    // ============================

    public List<Grievance> getCitizenGrievances(Long citizenId) {

        return grievanceRepository.findByCitizenId(citizenId);
    }

    // ============================
    // GET OFFICER GRIEVANCES
    // ============================

    /*
        Since officer assignment is now handled by the Assignment module,
        this method will later fetch data through AssignmentService.

        Keeping this placeholder avoids breaking the controller while we
        complete the integration.
    */
// ============================
// GET OFFICER GRIEVANCES
// ============================

public List<Grievance> getOfficerGrievances(Long officerId) {

    return grievanceRepository.findByAssignedOfficerId(officerId);
}
        // ============================
    // ASSIGN OFFICER
    // ============================

 public Grievance assignOfficer(
        Long id,
        AssignOfficerRequest request) {

    Grievance grievance = grievanceRepository.findById(id)
            .orElseThrow(() ->
                    new RuntimeException("Grievance not found"));

    grievance.setAssignedOfficerId(
            request.getOfficerId()
    );

    grievance.setAssignedOfficer(
            request.getAssignedOfficer()
    );

    grievance.setPriority(
            request.getPriority()
    );

    grievance.setStatus("IN_PROGRESS");

    Grievance updated =
            grievanceRepository.save(grievance);

    grievanceHistoryService.save(
            new GrievanceHistory(
                    updated.getId(),
                    "OPEN",
                    "IN_PROGRESS",
                    "Officer Assigned",
                    "Admin"
            )
    );

    return updated;
}
    // ============================
    // UPDATE STATUS
    // ============================

    public Grievance updateStatus(
        Long id,
        String status) {

    Grievance grievance = grievanceRepository.findById(id)
            .orElseThrow(() ->
                    new RuntimeException("Grievance not found"));

    String oldStatus = grievance.getStatus();

    grievance.setStatus(status);

    Grievance updatedGrievance =
            grievanceRepository.save(grievance);

    grievanceHistoryService.save(

            new GrievanceHistory(

                    updatedGrievance.getId(),
                    oldStatus,
                    status,
                    "Status Updated",
                    "Officer"

            )
    );

    return updatedGrievance;
}

    // ============================
    // UPDATE REMARKS
    // ============================

    public Grievance updateRemarks(
            Long id,
            String remarks) {

        Grievance grievance = grievanceRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Grievance not found"));

        grievance.setRemarks(remarks);

        return grievanceRepository.save(grievance);
    }
        // ============================
    // DASHBOARD COUNTS
    // ============================

    public DashboardCounts getDashboardCounts() {

        long total = grievanceRepository.count();

        long pending =
                grievanceRepository.countByStatusIgnoreCase("PENDING");

        long inProgress =
                grievanceRepository.countByStatusIgnoreCase("IN_PROGRESS");

        long resolved =
                grievanceRepository.countByStatusIgnoreCase("RESOLVED");

        long closed =
                grievanceRepository.countByStatusIgnoreCase("CLOSED");
long escalated =
        grievanceRepository.countByEscalatedTrue();
        return new DashboardCounts(
        total,
        pending,
        inProgress,
        resolved,
        closed,
        escalated
);
    }

    // ============================
    // DELETE GRIEVANCE
    // ============================

    public void deleteGrievance(Long id) {

        if (!grievanceRepository.existsById(id)) {
            throw new RuntimeException("Grievance not found");
        }

        grievanceRepository.deleteById(id);
    }

}