package com.civicpulse.audit_service.controller;

import com.civicpulse.audit_service.dto.AuditLogRequest;
import com.civicpulse.audit_service.dto.AuditLogResponse;
import com.civicpulse.audit_service.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/audit")
@RequiredArgsConstructor
public class AuditController {

    private final AuditService auditService;

    @PostMapping
    public AuditLogResponse createAuditLog(
            @RequestBody AuditLogRequest request) {

        return auditService.save(request);
    }

    @GetMapping
    public List<AuditLogResponse> getAllLogs() {

        return auditService.getAllLogs();
    }

    @GetMapping("/user/{userId}")
    public List<AuditLogResponse> getLogsByUser(
            @PathVariable Long userId) {

        return auditService.getLogsByUser(userId);
    }

    @GetMapping("/module/{module}")
    public List<AuditLogResponse> getLogsByModule(
            @PathVariable String module) {

        return auditService.getLogsByModule(module);
    }
}