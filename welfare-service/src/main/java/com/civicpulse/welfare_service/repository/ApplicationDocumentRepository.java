package com.civicpulse.welfare_service.repository;

import com.civicpulse.welfare_service.entity.ApplicationDocument;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationDocumentRepository
        extends JpaRepository<ApplicationDocument, Long> {
}