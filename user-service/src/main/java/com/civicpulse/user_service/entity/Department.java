package com.civicpulse.user_service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "departments")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String departmentCode;

    @Column(nullable = false)
    private String officeEmail;

    @Column(nullable = false)
    private String contactNumber;

    private String officeAddress;

    @Column(nullable = false)
    private boolean active = true;

    public Department() {
    }

    public Department(Long id,
                      String name,
                      String description,
                      String departmentCode,
                      String officeEmail,
                      String contactNumber,
                      String officeAddress,
                      boolean active) {

        this.id = id;
        this.name = name;
        this.description = description;
        this.departmentCode = departmentCode;
        this.officeEmail = officeEmail;
        this.contactNumber = contactNumber;
        this.officeAddress = officeAddress;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDepartmentCode() {
        return departmentCode;
    }

    public void setDepartmentCode(String departmentCode) {
        this.departmentCode = departmentCode;
    }

    public String getOfficeEmail() {
        return officeEmail;
    }

    public void setOfficeEmail(String officeEmail) {
        this.officeEmail = officeEmail;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getOfficeAddress() {
        return officeAddress;
    }

    public void setOfficeAddress(String officeAddress) {
        this.officeAddress = officeAddress;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}