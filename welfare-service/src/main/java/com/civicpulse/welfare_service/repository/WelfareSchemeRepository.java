package com.civicpulse.welfare_service.repository;

import com.civicpulse.welfare_service.entity.ApplicationStatus;
import com.civicpulse.welfare_service.entity.WelfareApplication;
import com.civicpulse.welfare_service.entity.WelfareScheme;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WelfareSchemeRepository extends JpaRepository<WelfareScheme, Long> {

    boolean existsBySchemeName(String schemeName);

    boolean existsBySchemeCode(String schemeCode);

    Optional<WelfareScheme> findBySchemeCode(String schemeCode);

    List<WelfareScheme> findByCategory(String category);

    List<WelfareScheme> findByDepartment(String department);

    List<WelfareScheme> findByActiveTrue();

    List<WelfareApplication> findByStatus(ApplicationStatus status);

    long countByActiveTrue();
}