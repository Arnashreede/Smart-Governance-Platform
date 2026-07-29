package com.civicpulse.welfare_service.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WelfareApplicationResponse {

    private Long id;

    private Long citizenId;

    private Long schemeId;

    private String schemeName;

    private String fullName;

    private Integer age;

    private String district;

    private String occupation;

    private Double annualIncome;

    private String remarks;

    private String status;

    private String eligibilityStatus;

    private String appliedAt;

}