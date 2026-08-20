package com.civicpulse.reporting_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CitizenDashboardResponse {

    private long applications;
    private long certificates;
    private long grievances;
    private long welfareApplications;
    private long pendingRequests;
    private long approvedRequests;
}