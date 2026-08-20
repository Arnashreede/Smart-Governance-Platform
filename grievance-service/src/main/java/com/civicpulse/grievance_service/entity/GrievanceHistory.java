package com.civicpulse.grievance_service.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "grievance_history")
public class GrievanceHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long grievanceId;

    private String oldStatus;

    private String newStatus;

    private String remarks;

    private String updatedBy;

    private LocalDateTime updatedAt = LocalDateTime.now();

    public GrievanceHistory() {
    }

    public GrievanceHistory(
            Long grievanceId,
            String oldStatus,
            String newStatus,
            String remarks,
            String updatedBy) {

        this.grievanceId = grievanceId;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
        this.remarks = remarks;
        this.updatedBy = updatedBy;
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Long getGrievanceId() {
        return grievanceId;
    }

    public void setGrievanceId(Long grievanceId) {
        this.grievanceId = grievanceId;
    }

    public String getOldStatus() {
        return oldStatus;
    }

    public void setOldStatus(String oldStatus) {
        this.oldStatus = oldStatus;
    }

    public String getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(String newStatus) {
        this.newStatus = newStatus;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}