package com.civicpulse.officer_service.entity;

import com.civicpulse.officer_service.enums.OfficerStatus;
import jakarta.persistence.*;

@Entity
@Table(name = "officers")
public class Officer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String employeeId;

    @Column(nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true, nullable = false)
    private String phone;

    @Column(nullable = false)
    private String department;

    @Column(nullable = false)
    private String designation;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OfficerStatus status = OfficerStatus.PENDING;

    @Column(nullable = false)
    private boolean active = true;
@Column(nullable = false)
private Long departmentId;
    public Officer() {
    }

    public Officer(Long id,
               String employeeId,
               String fullName,
               String email,
               String phone,
               String department,
               Long departmentId,
               String designation,
               String password,
               OfficerStatus status,
               boolean active) {

    this.id = id;
    this.employeeId = employeeId;
    this.fullName = fullName;
    this.email = email;
    this.phone = phone;
    this.department = department;
    this.departmentId = departmentId;
    this.designation = designation;
    this.password = password;
    this.status = status;
    this.active = active;
}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public OfficerStatus getStatus() {
        return status;
    }

    public void setStatus(OfficerStatus status) {
        this.status = status;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
    public Long getDepartmentId() {
    return departmentId;
}

public void setDepartmentId(Long departmentId) {
    this.departmentId = departmentId;
}
}