package com.civicpulse.audit_service.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLogResponse {

    private Long id;

    private Long userId;

    private String userRole;

    private String module;

    private String action;

    private String details;

    private LocalDateTime timestamp;
}