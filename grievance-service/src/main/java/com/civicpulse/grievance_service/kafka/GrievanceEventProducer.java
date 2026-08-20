package com.civicpulse.grievance_service.kafka;

import com.civicpulse.grievance_service.event.GrievanceCreatedEvent;
import com.civicpulse.grievance_service.event.GrievanceStatusUpdatedEvent;

import com.civicpulse.grievance_service.event.SlaBreachedEvent;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class GrievanceEventProducer {

    private static final String GRIEVANCE_CREATED_TOPIC = "grievance-created";
    private static final String GRIEVANCE_STATUS_UPDATED_TOPIC = "grievance-status-updated";
private static final String SLA_BREACHED_TOPIC =
        "sla-breached";
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public GrievanceEventProducer(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    // Publish when a grievance is created
    public void publishGrievanceCreatedEvent(GrievanceCreatedEvent event) {

        kafkaTemplate.send(GRIEVANCE_CREATED_TOPIC, event);

        System.out.println("Grievance Created Event Published Successfully");
    }

    // Publish when grievance status changes
    public void publishStatusUpdatedEvent(GrievanceStatusUpdatedEvent event) {

        kafkaTemplate.send(GRIEVANCE_STATUS_UPDATED_TOPIC, event);

        System.out.println("Grievance Status Updated Event Published Successfully");
    }
    public void publishSlaBreachedEvent(
        SlaBreachedEvent event) {

    kafkaTemplate.send(
            SLA_BREACHED_TOPIC,
            event
    );

    System.out.println(
            "SLA Breached Event Published"
    );
}
}