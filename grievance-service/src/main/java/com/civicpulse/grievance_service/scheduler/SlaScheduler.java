package com.civicpulse.grievance_service.scheduler;

import com.civicpulse.grievance_service.entity.Grievance;
import com.civicpulse.grievance_service.repository.GrievanceRepository;

import com.civicpulse.grievance_service.event.SlaBreachedEvent;
import com.civicpulse.grievance_service.kafka.GrievanceEventProducer;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class SlaScheduler {

    private final GrievanceRepository grievanceRepository;
private final GrievanceEventProducer grievanceEventProducer;
    public SlaScheduler(
        GrievanceRepository grievanceRepository,
        GrievanceEventProducer grievanceEventProducer) {

    this.grievanceRepository = grievanceRepository;
    this.grievanceEventProducer = grievanceEventProducer;
}

    @Scheduled(fixedRate = 60000)
    public void checkSla() {

        List<Grievance> grievances =
                grievanceRepository.findAll();

        for (Grievance grievance : grievances) {

            if (!grievance.isEscalated()
                    && grievance.getDueDate() != null
                    && grievance.getDueDate().isBefore(LocalDateTime.now())
                    && !"CLOSED".equalsIgnoreCase(grievance.getStatus())
                    && !"RESOLVED".equalsIgnoreCase(grievance.getStatus())) {

                grievance.setEscalated(true);

                grievanceRepository.save(grievance);
grievanceEventProducer.publishSlaBreachedEvent(

        new SlaBreachedEvent(

                grievance.getId(),
                grievance.getCitizenId(),
                grievance.getTitle(),
                grievance.getDepartment()

        )

);
                System.out.println(
                        "SLA Breached : " + grievance.getId()
                );
            }
        }
    }
}