package com.civicpulse.grievance_service.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GrievanceCreatedEvent {

    private Long grievanceId;

    private Long citizenId;

    private String title;

    private String department;

    private String category;

    private String status;

    private String priority;
}