package com.civicpulse.notification_service.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Receiver Information
    private Long citizenId;

    private Long officerId;

    private String recipientRole;

    // Notification Details
    @Column(nullable = false)
    private String title;

    @Column(length = 3000)
    private String message;

    @Column(nullable = false)
    private String type;

    // Related Module
    private String module;

    private Long referenceId;

    // Read Status
    private boolean isRead = false;

    // Time
    private LocalDateTime createdAt = LocalDateTime.now();
private LocalDateTime updatedAt;
    public Notification() {
    }

    public Notification(Long citizenId,
                        Long officerId,
                        String recipientRole,
                        String title,
                        String message,
                        String type,
                        String module,
                        Long referenceId) {

        this.citizenId = citizenId;
        this.officerId = officerId;
        this.recipientRole = recipientRole;
        this.title = title;
        this.message = message;
        this.type = type;
        this.module = module;
        this.referenceId = referenceId;
        this.createdAt = LocalDateTime.now();
        this.isRead = false;
    }

    public Long getId() {
        return id;
    }

    public Long getCitizenId() {
        return citizenId;
    }

    public void setCitizenId(Long citizenId) {
        this.citizenId = citizenId;
    }

    public Long getOfficerId() {
        return officerId;
    }

    public void setOfficerId(Long officerId) {
        this.officerId = officerId;
    }

    public String getRecipientRole() {
        return recipientRole;
    }

    public void setRecipientRole(String recipientRole) {
        this.recipientRole = recipientRole;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getModule() {
        return module;
    }

    public void setModule(String module) {
        this.module = module;
    }

    public Long getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(Long referenceId) {
        this.referenceId = referenceId;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public LocalDateTime getUpdatedAt() {
    return updatedAt;
}

public void setUpdatedAt(LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
}

}