package com.civicpulse.reporting_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "grievance_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GrievanceReport {

    @Id
    private Long grievanceId;

    private Long citizenId;

    private String title;

    private String category;

    private String status;

    private String priority;

    private boolean escalated;
}