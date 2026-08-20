package com.civicpulse.welfare_service.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class WelfareApplicationResponse {

    private Long id;

    private Long citizenId;

    private Long schemeId;

    private String schemeName;

    // ================= COMMON =================

    private String fullName;

    private Integer age;

    private String district;

    private String occupation;

    private Double annualIncome;

    private BigDecimal benefitAmount;

    private String remarks;

    private String status;

    private String eligibilityStatus;

    private String appliedAt;

    // ================= PAYMENT =================

    private Boolean benefitIssued;

    private String benefitIssuedAt;

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
private String gender;
private String aadhaarNumber;
private String mobileNumber;
private String email;

private String accountHolderName;
private String bankName;
    // ================= PENSION =================

    private String maritalStatus;

    private String pensionCategory;

    private Integer disabilityPercentage;

    // ================= DOCUMENTS =================

    private List<ApplicationDocumentResponse> documents;
}