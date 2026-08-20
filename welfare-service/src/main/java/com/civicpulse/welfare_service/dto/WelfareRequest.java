package com.civicpulse.welfare_service.dto;

import com.civicpulse.welfare_service.entity.SchemeType;
import com.civicpulse.welfare_service.enums.SchemeStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class WelfareRequest {

    private String schemeName;

    private SchemeType schemeType;

    private String department;

    private String description;

    private String category;

    private String eligibilityCriteria;

    private List<String> requiredDocuments;

    private BigDecimal benefitAmount;

    private BigDecimal allocatedBudget;

    private Long budgetId;

    private Integer maxBeneficiaries;

    private BigDecimal maxIncome;

    private Integer minimumAge;

    private Integer maximumAge;

    private LocalDate startDate;

    private LocalDate endDate;


    private Boolean active;
}