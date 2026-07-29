package com.civicpulse.budget_service.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class BudgetRequest {

    private String department;

    private String financialYear;

    private BigDecimal totalBudget;

}