package com.civicpulse.welfare_service.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class DashboardResponse {

    private long totalSchemes;
    private long activeSchemes;

    private long totalApplications;
    private long approvedApplications;
    private long pendingApplications;
    private long rejectedApplications;

    private long totalBeneficiaries;

    private BigDecimal allocatedBudget;
    private BigDecimal utilizedBudget;
    private BigDecimal remainingBudget;
}