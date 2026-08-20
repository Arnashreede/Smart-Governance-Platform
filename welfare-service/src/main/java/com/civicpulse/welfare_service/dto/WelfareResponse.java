package com.civicpulse.welfare_service.dto;

import com.civicpulse.welfare_service.entity.SchemeType;
import com.civicpulse.welfare_service.enums.SchemeStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class WelfareResponse {

    private Long id;

    private String schemeCode;

    private String schemeName;

    private SchemeType schemeType;

    private String department;

    private String description;

    private String category;
private String bankName;

private String accountHolderName;
    private String eligibilityCriteria;

    private List<String> requiredDocuments;

    private BigDecimal benefitAmount;

    private BigDecimal allocatedBudget;

    private Long budgetId;

    private BigDecimal utilizedBudget;

    private Integer maxBeneficiaries;

    private BigDecimal maxIncome;

    private Integer minimumAge;

    private Integer maximumAge;

    private LocalDate startDate;

    private LocalDate endDate;

    private SchemeStatus status;

    private Boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}