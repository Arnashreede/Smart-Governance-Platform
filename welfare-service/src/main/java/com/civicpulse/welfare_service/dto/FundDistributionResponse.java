package com.civicpulse.welfare_service.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class FundDistributionResponse {

    private Long id;
    private Long schemeId;
    private String schemeName;
    private Long citizenId;
    private String beneficiaryName;
    private BigDecimal amount;
}