package com.civicpulse.welfare_service.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class WelfareRequest {

    private String schemeName;

    private String department;

    private String description;

    private String category;

    private BigDecimal benefitAmount;

    private BigDecimal allocatedBudget;

    private Integer maxBeneficiaries;

    private BigDecimal maxIncome;

    private Integer minimumAge;

    private Integer maximumAge;

    private String eligibilityCriteria;

    private LocalDate startDate;

    private LocalDate endDate;

    private Boolean active;
    private Long budgetId;
}