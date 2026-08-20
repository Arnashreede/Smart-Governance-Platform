package com.civicpulse.notification_service.controller;

import com.civicpulse.notification_service.entity.Notification;
import com.civicpulse.notification_service.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    // Create Notification
    @PostMapping
    public Notification createNotification(
            @RequestBody Notification notification) {

        return service.save(notification);
    }

    // Citizen Notifications
    @GetMapping("/citizen/{citizenId}")
    public List<Notification> getCitizenNotifications(
            @PathVariable Long citizenId) {

        return service.getCitizenNotifications(citizenId);
    }
    @PutMapping("/citizen/{citizenId}/read-all")
public String markAllCitizenNotificationsAsRead(
        @PathVariable Long citizenId) {

    service.markAllCitizenNotificationsAsRead(citizenId);

    return "All citizen notifications marked as read.";
}

    // Officer Notifications
    @GetMapping("/officer/{officerId}")
    public List<Notification> getOfficerNotifications(
            @PathVariable Long officerId) {

        return service.getOfficerNotifications(officerId);
    }
@PutMapping("/officer/{officerId}/read-all")
public String markAllOfficerNotificationsAsRead(
        @PathVariable Long officerId) {

    service.markAllOfficerNotificationsAsRead(officerId);

    return "All officer notifications marked as read.";
}
    // All Notifications
    @GetMapping
    public List<Notification> getAllNotifications() {

        return service.getAllNotifications();
    }

    // Mark Notification as Read
    @PutMapping("/{id}/read")
    public Notification markAsRead(
            @PathVariable Long id) {

        return service.markAsRead(id);
    }

    // Delete Notification
    @DeleteMapping("/{id}")
    public String deleteNotification(
            @PathVariable Long id) {

        service.deleteNotification(id);

        return "Notification deleted successfully.";
    }
    @GetMapping("/citizen/{citizenId}/unread")
public List<Notification> getUnreadCitizenNotifications(
        @PathVariable Long citizenId) {

    return service.getUnreadCitizenNotifications(citizenId);
}
@GetMapping("/officer/{officerId}/unread")
public List<Notification> getUnreadOfficerNotifications(
        @PathVariable Long officerId) {

    return service.getUnreadOfficerNotifications(officerId);
}
@GetMapping("/citizen/{citizenId}/count")
public long getCitizenUnreadCount(
        @PathVariable Long citizenId) {

    return service.getUnreadCitizenCount(citizenId);
}
@GetMapping("/officer/{officerId}/count")
public long getOfficerUnreadCount(
        @PathVariable Long officerId) {

    return service.getUnreadOfficerCount(officerId);
}
}