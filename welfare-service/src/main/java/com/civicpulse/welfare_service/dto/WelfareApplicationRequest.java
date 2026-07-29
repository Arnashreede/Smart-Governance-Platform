package com.civicpulse.welfare_service.dto;

import lombok.Data;

@Data
public class WelfareApplicationRequest {

    private Long citizenId;

    private Long schemeId;

    private String fullName;

    private Integer age;

    private String district;

    private String occupation;

    private Double annualIncome;

    private String remarks;

}