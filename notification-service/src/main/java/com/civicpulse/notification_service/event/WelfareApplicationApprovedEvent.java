package com.civicpulse.notification_service.event;

public class WelfareApplicationApprovedEvent {

    private Long applicationId;
    private Long citizenId;
    private String schemeName;

    public WelfareApplicationApprovedEvent() {
    }

    public WelfareApplicationApprovedEvent(
            Long applicationId,
            Long citizenId,
            String schemeName) {

        this.applicationId = applicationId;
        this.citizenId = citizenId;
        this.schemeName = schemeName;
    }

    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }

    public Long getCitizenId() {
        return citizenId;
    }

    public void setCitizenId(Long citizenId) {
        this.citizenId = citizenId;
    }

    public String getSchemeName() {
        return schemeName;
    }

    public void setSchemeName(String schemeName) {
        this.schemeName = schemeName;
    }
}