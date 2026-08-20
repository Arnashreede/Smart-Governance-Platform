package com.civicpulse.reporting_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

@Data
@AllArgsConstructor
public class DashboardAnalyticsResponse {

    private Map<String, Long> grievanceStatus;

    private Map<String, Long> grievancePriority;

    private Map<String, Long> monthlyGrievances;

    private Map<String, Long> certificateTypes;

}