package com.civicpulse.welfare_service.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ReportResponse {

    private Long schemeId;
    private String schemeName;

    private long totalApplications;
    private long approvedApplications;
    private long rejectedApplications;
    private long pendingApplications;

    private long totalBeneficiaries;

    private BigDecimal allocatedBudget;
    private BigDecimal utilizedBudget;
    private BigDecimal remainingBudget;
}