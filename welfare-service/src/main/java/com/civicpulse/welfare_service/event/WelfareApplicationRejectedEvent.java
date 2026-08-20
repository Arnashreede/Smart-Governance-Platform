package com.civicpulse.welfare_service.event;

public class WelfareApplicationRejectedEvent {

    private Long applicationId;
    private Long citizenId;
    private String schemeName;
    private String rejectionReason;

    public WelfareApplicationRejectedEvent() {
    }

    public WelfareApplicationRejectedEvent(
            Long applicationId,
            Long citizenId,
            String schemeName,
            String rejectionReason) {

        this.applicationId = applicationId;
        this.citizenId = citizenId;
        this.schemeName = schemeName;
        this.rejectionReason = rejectionReason;
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

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
}