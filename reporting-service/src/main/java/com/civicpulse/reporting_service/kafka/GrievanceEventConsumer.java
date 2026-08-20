package com.civicpulse.reporting_service.kafka;

import com.civicpulse.reporting_service.entity.GrievanceReport;
import com.civicpulse.reporting_service.event.GrievanceCreatedEvent;
import com.civicpulse.reporting_service.repository.GrievanceReportRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class GrievanceEventConsumer {

    private final GrievanceReportRepository repository;

    public GrievanceEventConsumer(GrievanceReportRepository repository) {
        this.repository = repository;
    }

    @KafkaListener(
        topics = "grievance-created",
        groupId = "reporting-group",
        containerFactory = "grievanceKafkaListenerContainerFactory"
)
    public void consumeGrievance(GrievanceCreatedEvent event) {

        GrievanceReport report = new GrievanceReport();

        report.setGrievanceId(event.getGrievanceId());
        report.setCitizenId(event.getCitizenId());
        report.setTitle(event.getTitle());
        report.setCategory(event.getCategory());
        report.setStatus(event.getStatus());
        report.setPriority(event.getPriority());
report.setEscalated(false);
        repository.save(report);

        System.out.println("Grievance saved in Reporting DB: "
                + event.getTitle());
    }
}