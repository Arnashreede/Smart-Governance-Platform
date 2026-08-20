package com.civicpulse.reporting_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardResponse {

    private long totalCitizens;

    private long totalGrievances;

    private long openGrievances;

    private long highPriorityGrievances;

    private long totalCertificates;

    private long totalOfficers;

    private long totalDepartments;

    private long totalApplications;
    
    private Double totalBudget;

    private Double allocatedAmount;

    private Double spentAmount;

    private Double remainingAmount;

    private long escalatedGrievances;
}