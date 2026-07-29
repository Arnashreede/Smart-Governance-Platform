package com.civicpulse.budget_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {

    private Double totalBudget;
    private Double allocatedAmount;
    private Double spentAmount;
    private Double remainingAmount;
}