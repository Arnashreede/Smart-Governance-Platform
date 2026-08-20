package com.civicpulse.citizen_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CitizenResponse {

    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String aadhaarNumber;
}