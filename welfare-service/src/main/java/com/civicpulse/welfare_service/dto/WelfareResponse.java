package com.civicpulse.welfare_service.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class WelfareResponse {

    private Long id;

    private String schemeName;

    private String department;

    private String description;

    private String category;

    private BigDecimal benefitAmount;

    private BigDecimal allocatedBudget;

    private Long budgetId;

    private Integer maxBeneficiaries;

    private BigDecimal maxIncome;

    private Integer minimumAge;

    private Integer maximumAge;

    private String eligibilityCriteria;

    private LocalDate startDate;

    private LocalDate endDate;

    private Boolean active;
}