package com.civicpulse.service_management_service.repository;

import com.civicpulse.service_management_service.entity.GovernmentService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceRepository
        extends JpaRepository<GovernmentService, Long> {

    List<GovernmentService> findByDepartmentId(Long departmentId);

    List<GovernmentService> findByActiveTrue();

    boolean existsByNameIgnoreCase(String name);
}