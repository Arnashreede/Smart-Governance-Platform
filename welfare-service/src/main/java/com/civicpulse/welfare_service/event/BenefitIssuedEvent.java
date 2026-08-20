package com.civicpulse.welfare_service.event;

public class BenefitIssuedEvent {

    private Long beneficiaryId;
    private Long citizenId;
    private Long applicationId;
    private String schemeName;
    private Double amount;
private Long budgetId;
    public BenefitIssuedEvent() {
    }

    public BenefitIssuedEvent(
        Long beneficiaryId,
        Long citizenId,
        Long applicationId,
        Long budgetId,
        String schemeName,
        Double amount) {

    this.beneficiaryId = beneficiaryId;
    this.citizenId = citizenId;
    this.applicationId = applicationId;
    this.budgetId = budgetId;
    this.schemeName = schemeName;
    this.amount = amount;
}

    public Long getBeneficiaryId() {
        return beneficiaryId;
    }

    public void setBeneficiaryId(Long beneficiaryId) {
        this.beneficiaryId = beneficiaryId;
    }

    public Long getCitizenId() {
        return citizenId;
    }

    public void setCitizenId(Long citizenId) {
        this.citizenId = citizenId;
    }

    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }

    public String getSchemeName() {
        return schemeName;
    }

    public void setSchemeName(String schemeName) {
        this.schemeName = schemeName;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
    public Long getBudgetId() {
    return budgetId;
}

public void setBudgetId(Long budgetId) {
    this.budgetId = budgetId;
}
}