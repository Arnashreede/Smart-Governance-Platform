package com.civicpulse.budget_service.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class FundDistributionResponse {

    private Long id;

private Long schemeId;

private String schemeName;

private Long citizenId;

private String beneficiaryName;

private BigDecimal amount;

private Long budgetId;
private String paymentMode;

private String remarks;
}