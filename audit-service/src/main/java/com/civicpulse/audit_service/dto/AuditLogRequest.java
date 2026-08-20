package com.civicpulse.audit_service.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLogRequest {

    private Long userId;

    private String userRole;

    private String module;

    private String action;

    private String details;
}