package com.civicpulse.reporting_service.kafka;

import com.civicpulse.reporting_service.entity.GrievanceReport;
import com.civicpulse.reporting_service.event.SlaBreachedEvent;
import com.civicpulse.reporting_service.repository.GrievanceReportRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class SlaBreachedConsumer {

    private final GrievanceReportRepository repository;

    public SlaBreachedConsumer(
            GrievanceReportRepository repository) {

        this.repository = repository;
    }

    @KafkaListener(
            topics = "sla-breached",
            groupId = "reporting-group"
    )
    public void consume(
            SlaBreachedEvent event) {

        repository.findById(event.getGrievanceId())
                .ifPresent(report -> {

                    report.setEscalated(true);

                    repository.save(report);

                    System.out.println(
                            "Reporting updated for SLA breach: "
                                    + report.getGrievanceId()
                    );

                });
    }
}