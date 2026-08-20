package com.civicpulse.user_service.dto;

public class LoginResponse {

    private String token;
    private String role;
    private Long id;
    private String email;
    private String fullName;
    private Long departmentId;
    private String departmentName;

    public LoginResponse(String token,
                         String role,
                         Long id,
                         String email,
                         String fullName,
                         Long departmentId,
                         String departmentName) {

        this.token = token;
        this.role = role;
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }
}