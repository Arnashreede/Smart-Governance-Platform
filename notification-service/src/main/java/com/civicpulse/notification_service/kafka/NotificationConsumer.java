package com.civicpulse.notification_service.kafka;

import com.civicpulse.notification_service.entity.Notification;
import com.civicpulse.notification_service.event.GrievanceCreatedEvent;
import com.civicpulse.notification_service.service.NotificationService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import com.civicpulse.notification_service.event.GrievanceStatusUpdatedEvent;
import com.civicpulse.notification_service.event.WelfareApplicationSubmittedEvent;
import com.civicpulse.notification_service.event.WelfareApplicationApprovedEvent;
import com.civicpulse.notification_service.event.WelfareApplicationRejectedEvent;
import com.civicpulse.notification_service.event.SlaBreachedEvent;
@Component
public class NotificationConsumer {

    private final NotificationService notificationService;

    public NotificationConsumer(NotificationService notificationService) {
        this.notificationService = notificationService;
    }
    @KafkaListener(
        topics = "welfare-application-rejected",
        groupId = "notification-group"
)
@KafkaListener(
        topics = "sla-breached",
        groupId = "notification-group"
)
public void consumeSlaBreached(
        SlaBreachedEvent event) {

    Notification notification = new Notification(
            null,
            null,
            "ADMIN",
            "SLA Breached",
            "Grievance \"" + event.getTitle()
                    + "\" from "
                    + event.getDepartment()
                    + " has exceeded its SLA.",
            "WARNING",
            "GRIEVANCE",
            event.getGrievanceId()
    );

    notificationService.save(notification);

    System.out.println(
            "SLA notification created for Admin."
    );
}
public void consumeRejected(
        WelfareApplicationRejectedEvent event) {

    Notification notification = new Notification(
            event.getCitizenId(),
            null,
            "CITIZEN",
            "Application Rejected",
            "Your application for \""
                    + event.getSchemeName()
                    + "\" has been rejected.\nReason: "
                    + event.getRejectionReason(),
            "ERROR",
            "WELFARE",
            event.getApplicationId()
    );

    notificationService.save(notification);

    System.out.println(
            "Rejection notification created for Citizen ID: "
                    + event.getCitizenId()
    );
}
@KafkaListener(
        topics = "welfare-application-submitted",
        groupId = "notification-group"
)
public void consumeWelfareApplicationSubmitted(
        WelfareApplicationSubmittedEvent event) {

    Notification notification = new Notification(
            event.getCitizenId(),
            null,
            "CITIZEN",
            "Application Submitted",
            "Your application for \"" + event.getSchemeName()
                    + "\" has been submitted successfully.",
            "SUCCESS",
            "WELFARE",
            event.getApplicationId()
    );

    notificationService.save(notification);

    System.out.println(
            "Welfare notification created for Citizen "
                    + event.getCitizenId()
    );
}
    @KafkaListener(
            topics = "grievance-created",
            groupId = "notification-group"
    )
    public void consumeGrievanceCreated(
            GrievanceCreatedEvent event) {

        Notification notification = new Notification(
                event.getCitizenId(),          // Citizen ID
                null,                          // Officer ID
                "CITIZEN",                     // Recipient Role
                "Grievance Submitted",
                "Your grievance \"" + event.getTitle()
                        + "\" has been submitted successfully.",
                "SUCCESS",
                "GRIEVANCE",
                event.getGrievanceId()
        );

        notificationService.save(notification);

        System.out.println(
                "Notification created for Citizen ID: "
                        + event.getCitizenId()
        );
    }
    @KafkaListener(
        topics = "grievance-status-updated",
        groupId = "notification-group"
)
public void consumeGrievanceStatusUpdated(
        GrievanceStatusUpdatedEvent event) {

    Notification notification = new Notification(
            event.getCitizenId(),
            null,
            "CITIZEN",
            "Grievance Status Updated",
            "Your grievance \"" + event.getTitle()
                    + "\" is now "
                    + event.getStatus() + ".",
            "INFO",
            "GRIEVANCE",
            event.getGrievanceId()
    );

    notificationService.save(notification);

    System.out.println(
            "Status notification created for Citizen "
                    + event.getCitizenId()
    );
}
@KafkaListener(
        topics = "welfare-application-approved",
        groupId = "notification-group"
)
public void consumeApproved(
        WelfareApplicationApprovedEvent event) {

    Notification notification = new Notification(
            event.getCitizenId(),
            null,
            "CITIZEN",
            "Application Approved",
            "Congratulations! Your application for \""
                    + event.getSchemeName()
                    + "\" has been approved.",
            "SUCCESS",
            "WELFARE",
            event.getApplicationId()
    );

    notificationService.save(notification);

    System.out.println("Approval notification created.");
}
}