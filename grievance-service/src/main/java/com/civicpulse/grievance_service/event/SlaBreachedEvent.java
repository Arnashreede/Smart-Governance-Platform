package com.civicpulse.grievance_service.event;

public class SlaBreachedEvent {

    private Long grievanceId;
    private Long citizenId;
    private String title;
    private String department;

    public SlaBreachedEvent() {
    }

    public SlaBreachedEvent(
            Long grievanceId,
            Long citizenId,
            String title,
            String department) {

        this.grievanceId = grievanceId;
        this.citizenId = citizenId;
        this.title = title;
        this.department = department;
    }

    public Long getGrievanceId() {
        return grievanceId;
    }

    public void setGrievanceId(Long grievanceId) {
        this.grievanceId = grievanceId;
    }

    public Long getCitizenId() {
        return citizenId;
    }

    public void setCitizenId(Long citizenId) {
        this.citizenId = citizenId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }
}