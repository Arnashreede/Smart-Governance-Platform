package com.civicpulse.user_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private String designation;
    private String department;
    private boolean active;
}