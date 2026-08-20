package com.civicpulse.welfare_service.repository;

import com.civicpulse.welfare_service.entity.ApplicationStatus;
import com.civicpulse.welfare_service.entity.WelfareApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WelfareApplicationRepository
        extends JpaRepository<WelfareApplication, Long> {

    List<WelfareApplication> findByCitizenId(Long citizenId);

    boolean existsByCitizenIdAndWelfareSchemeId(
            Long citizenId,
            Long welfareSchemeId
    );

    long countByStatus(ApplicationStatus status);

    long countByWelfareSchemeId(Long schemeId);

    long countByWelfareSchemeIdAndStatus(
            Long schemeId,
            ApplicationStatus status
    );

    List<WelfareApplication> findByStatus(ApplicationStatus status);

    // Department-wise applications
    List<WelfareApplication> findByDepartment(String department);
}