package com.civicpulse.notification_service.event;

public class GrievanceCreatedEvent {

    private Long grievanceId;

    private Long citizenId;

    private String title;

    private String department;

    private String category;

    private String status;

    private String priority;

    public GrievanceCreatedEvent() {
    }

    public GrievanceCreatedEvent(Long grievanceId,
                                 Long citizenId,
                                 String title,
                                 String department,
                                 String category,
                                 String status,
                                 String priority) {

        this.grievanceId = grievanceId;
        this.citizenId = citizenId;
        this.title = title;
        this.department = department;
        this.category = category;
        this.status = status;
        this.priority = priority;
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }
}