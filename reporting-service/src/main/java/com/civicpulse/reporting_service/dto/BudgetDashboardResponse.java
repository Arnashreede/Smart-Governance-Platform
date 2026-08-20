package com.civicpulse.reporting_service.dto;

import lombok.Data;

@Data
public class BudgetDashboardResponse {

    private Double totalBudget;
    private Double allocatedAmount;
    private Double spentAmount;
    private Double remainingAmount;

}