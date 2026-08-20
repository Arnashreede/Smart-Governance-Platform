package com.civicpulse.welfare_service.dto;

import lombok.Data;

@Data
public class WelfareApplicationRequest {

    private Long citizenId;

    private Long schemeId;

    // ================= COMMON =================

    private String fullName;

    private Integer age;

    private String district;

    private String occupation;

    private Double annualIncome;

    private String remarks;

    // ================= STUDENT =================

    private String collegeName;

    private String course;

    private Integer year;

    private String rollNumber;

    // ================= HOUSING =================

    private String houseType;

    private Integer familyMembers;

    private Boolean landOwnership;

    // ================= FARMER =================

    private Double landArea;

    private String cropType;

    private String bankAccount;

    private String ifscCode;

    // ================= PENSION =================

    private String maritalStatus;

    private String pensionCategory;

    private Integer disabilityPercentage;
    private String bankName;

private String accountHolderName;

}