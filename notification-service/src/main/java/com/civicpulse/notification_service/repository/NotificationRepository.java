package com.civicpulse.notification_service.repository;

import com.civicpulse.notification_service.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Citizen Notifications
    List<Notification> findByCitizenIdOrderByCreatedAtDesc(Long citizenId);

    // Officer Notifications
    List<Notification> findByOfficerIdOrderByCreatedAtDesc(Long officerId);

    // Unread Citizen Notifications
    List<Notification> findByCitizenIdAndIsReadFalseOrderByCreatedAtDesc(
            Long citizenId
    );

    // Unread Officer Notifications
    List<Notification> findByOfficerIdAndIsReadFalseOrderByCreatedAtDesc(
            Long officerId
    );

    // Dashboard Counts
    long countByCitizenIdAndIsReadFalse(Long citizenId);

    long countByOfficerIdAndIsReadFalse(Long officerId);

    // Module-wise Notifications
    List<Notification> findByModuleOrderByCreatedAtDesc(String module);

    // Notification Type
    List<Notification> findByTypeOrderByCreatedAtDesc(String type);

}