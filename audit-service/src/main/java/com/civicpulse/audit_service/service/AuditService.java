package com.civicpulse.audit_service.service;

import com.civicpulse.audit_service.dto.AuditLogRequest;
import com.civicpulse.audit_service.dto.AuditLogResponse;
import com.civicpulse.audit_service.entity.AuditLog;
import com.civicpulse.audit_service.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository repository;

    public AuditLogResponse save(AuditLogRequest request) {

        AuditLog log = AuditLog.builder()
                .userId(request.getUserId())
                .userRole(request.getUserRole())
                .module(request.getModule())
                .action(request.getAction())
                .details(request.getDetails())
                .timestamp(LocalDateTime.now())
                .build();

        repository.save(log);

        return map(log);
    }

    public List<AuditLogResponse> getAllLogs() {

        return repository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }

    public List<AuditLogResponse> getLogsByUser(Long userId) {

        return repository.findByUserId(userId)
                .stream()
                .map(this::map)
                .toList();
    }

    public List<AuditLogResponse> getLogsByModule(String module) {

        return repository.findByModule(module)
                .stream()
                .map(this::map)
                .toList();
    }

    private AuditLogResponse map(AuditLog log) {

        return AuditLogResponse.builder()
                .id(log.getId())
                .userId(log.getUserId())
                .userRole(log.getUserRole())
                .module(log.getModule())
                .action(log.getAction())
                .details(log.getDetails())
                .timestamp(log.getTimestamp())
                .build();
    }
}