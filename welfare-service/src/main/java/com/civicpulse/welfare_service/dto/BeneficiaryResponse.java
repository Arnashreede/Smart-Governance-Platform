package com.civicpulse.welfare_service.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class BeneficiaryResponse {

    private Long id;

    private Long citizenId;

    private String fullName;

    private String schemeName;

    private String district;

    private String occupation;

    private Double annualIncome;

    private BigDecimal benefitAmount;

    private Boolean benefitIssued;

    private String approvedAt;

    private String benefitIssuedAt;

}