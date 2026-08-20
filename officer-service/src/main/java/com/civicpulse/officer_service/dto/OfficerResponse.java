package com.civicpulse.officer_service.dto;

import com.civicpulse.officer_service.enums.OfficerStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class OfficerResponse {

    private Long id;
    private String employeeId;
    private String fullName;
    private String email;
    private String phone;
    private String department;
    private Long departmentId;
    private String designation;
    private OfficerStatus status;
    private boolean active;
}