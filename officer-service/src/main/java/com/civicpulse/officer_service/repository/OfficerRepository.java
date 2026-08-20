package com.civicpulse.officer_service.repository;

import com.civicpulse.officer_service.entity.Officer;
import com.civicpulse.officer_service.enums.OfficerStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OfficerRepository extends JpaRepository<Officer, Long> {

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    boolean existsByEmployeeId(String employeeId);

    Optional<Officer> findByEmployeeId(String employeeId);

    Optional<Officer> findByEmail(String email);

    List<Officer> findByDepartment(String department);

    List<Officer> findByDepartmentAndDesignation(
            String department,
            String designation
    );

    List<Officer> findByDepartmentAndStatus(
            String department,
            OfficerStatus status
    );

    List<Officer> findByStatus(OfficerStatus status);

    List<Officer> findByDepartmentOrderByDesignationAsc(String department);

    long countByDepartment(String department);

    long countByStatus(OfficerStatus status);
}