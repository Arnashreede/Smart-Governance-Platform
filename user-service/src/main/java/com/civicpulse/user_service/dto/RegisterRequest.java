package com.civicpulse.user_service.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    private String fullName;
    private String email;
    private String phone;
    private String designation;
    private String password;
    private String role;
    private Long departmentId;
}