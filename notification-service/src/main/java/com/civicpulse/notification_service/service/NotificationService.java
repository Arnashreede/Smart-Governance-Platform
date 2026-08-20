package com.civicpulse.notification_service.service;

import com.civicpulse.notification_service.entity.Notification;
import com.civicpulse.notification_service.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository repository;

    public NotificationService(NotificationRepository repository) {
        this.repository = repository;
    }

    // Save Notification
    public Notification save(Notification notification) {
        return repository.save(notification);
    }

    // Citizen Notifications
    public List<Notification> getCitizenNotifications(Long citizenId) {
        return repository.findByCitizenIdOrderByCreatedAtDesc(citizenId);
    }

    // Officer Notifications
    public List<Notification> getOfficerNotifications(Long officerId) {
        return repository.findByOfficerIdOrderByCreatedAtDesc(officerId);
    }

    // All Notifications (Admin)
    public List<Notification> getAllNotifications() {
        return repository.findAll();
    }

    // Mark Notification as Read
    public Notification markAsRead(Long id) {

        Notification notification = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Notification not found"));

        notification.setRead(true);

        return repository.save(notification);
    }

    // Delete Notification
    public void deleteNotification(Long id) {

        if (!repository.existsById(id)) {
            throw new RuntimeException("Notification not found");
        }

        repository.deleteById(id);
    }

    // Unread Count - Citizen
    public long getUnreadCitizenCount(Long citizenId) {
        return repository.countByCitizenIdAndIsReadFalse(citizenId);
    }

    // Unread Count - Officer
    public long getUnreadOfficerCount(Long officerId) {
        return repository.countByOfficerIdAndIsReadFalse(officerId);
    }

    // Unread Citizen Notifications
    public List<Notification> getUnreadCitizenNotifications(Long citizenId) {
        return repository
                .findByCitizenIdAndIsReadFalseOrderByCreatedAtDesc(citizenId);
    }

    // Unread Officer Notifications
    public List<Notification> getUnreadOfficerNotifications(Long officerId) {
        return repository
                .findByOfficerIdAndIsReadFalseOrderByCreatedAtDesc(officerId);
    }
    public void markAllCitizenNotificationsAsRead(Long citizenId) {

    List<Notification> notifications =
            repository.findByCitizenIdAndIsReadFalseOrderByCreatedAtDesc(citizenId);

    notifications.forEach(notification -> notification.setRead(true));

    repository.saveAll(notifications);

}
public void markAllOfficerNotificationsAsRead(Long officerId) {

    List<Notification> notifications =
            repository.findByOfficerIdAndIsReadFalseOrderByCreatedAtDesc(officerId);

    notifications.forEach(notification -> notification.setRead(true));

    repository.saveAll(notifications);

}
}