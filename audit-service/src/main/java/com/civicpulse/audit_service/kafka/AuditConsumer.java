package com.civicpulse.audit_service.kafka;

import com.civicpulse.audit_service.dto.AuditLogRequest;
import com.civicpulse.audit_service.event.GrievanceCreatedEvent;
import com.civicpulse.audit_service.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuditConsumer {

    private final AuditService auditService;

    @KafkaListener(topics = "grievance-created", groupId = "audit-group")
    public void consumeGrievanceCreated(GrievanceCreatedEvent event) {

        AuditLogRequest request = AuditLogRequest.builder()
                .userId(event.getCitizenId())
                .userRole("CITIZEN")
                .module("GRIEVANCE")
                .action("CREATE")
                .details("Created grievance: " + event.getTitle())
                .build();

        auditService.save(request);

        System.out.println("Audit log saved for grievance: " + event.getGrievanceId());
    }
}