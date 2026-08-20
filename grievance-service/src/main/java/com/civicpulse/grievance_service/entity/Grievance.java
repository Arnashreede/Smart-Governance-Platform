package com.civicpulse.grievance_service.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "grievances")
public class Grievance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long citizenId;

    @Column(nullable = false)
    private String title;

    @Column(length = 3000)
    private String description;

    @Column(nullable = false)
    private String department;
@Column(name = "department_id")
private Long departmentId;

    @Column(nullable = false)
    private String category;

    @Column(name = "assigned_officer")
private String assignedOfficer;

    @Column(nullable = false)
    private String status = "OPEN";

    @Column(nullable = false)
    private String priority = "LOW";

    @Column(length = 1000)
    private String remarks;
    @Column(name = "assigned_officer_id")
private Long assignedOfficerId;
private LocalDateTime createdAt = LocalDateTime.now();

private LocalDateTime dueDate;

private Integer slaHours = 72;

private boolean escalated = false;
    public Grievance() {
    }

    public Grievance(Long id,
                 Long citizenId,
                 String title,
                 String description,
                 String department,
                 Long departmentId,
                 String category,
                 String status,
                 String priority,
                 String remarks) {

    this.id = id;
    this.citizenId = citizenId;
    this.title = title;
    this.description = description;
    this.department = department;
    this.departmentId = departmentId;
    this.category = category;
    this.status = status;
    this.priority = priority;
    this.remarks = remarks;
}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
    public LocalDateTime getCreatedAt() {
    return createdAt;
}

public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
}

public LocalDateTime getDueDate() {
    return dueDate;
}

public void setDueDate(LocalDateTime dueDate) {
    this.dueDate = dueDate;
}

public Integer getSlaHours() {
    return slaHours;
}

public void setSlaHours(Integer slaHours) {
    this.slaHours = slaHours;
}

public boolean isEscalated() {
    return escalated;
}

public void setEscalated(boolean escalated) {
    this.escalated = escalated;
}
public Long getDepartmentId() {
    return departmentId;
}

public void setDepartmentId(Long departmentId) {
    this.departmentId = departmentId;
}
public String getAssignedOfficer() {
    return assignedOfficer;
}

public void setAssignedOfficer(String assignedOfficer) {
    this.assignedOfficer = assignedOfficer;
}
public Long getAssignedOfficerId() {
    return assignedOfficerId;
}

public void setAssignedOfficerId(Long assignedOfficerId) {
    this.assignedOfficerId = assignedOfficerId;
}
}