package com.civicpulse.officer_service.dto;

public class RegisterRequest {

    private String fullName;
    private String email;
    private String password;
    private String role;
private String phone;
private String designation;
private Long departmentId;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
    public String getPhone() {
    return phone;
}

public void setPhone(String phone) {
    this.phone = phone;
}

public String getDesignation() {
    return designation;
}

public void setDesignation(String designation) {
    this.designation = designation;
}

public Long getDepartmentId() {
    return departmentId;
}

public void setDepartmentId(Long departmentId) {
    this.departmentId = departmentId;
}
}