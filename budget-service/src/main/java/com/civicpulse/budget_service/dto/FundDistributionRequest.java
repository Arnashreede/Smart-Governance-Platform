package com.civicpulse.budget_service.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class FundDistributionRequest {

    private Long schemeId;
private String schemeName;
private Long citizenId;
private String beneficiaryName;
private BigDecimal amount;
}