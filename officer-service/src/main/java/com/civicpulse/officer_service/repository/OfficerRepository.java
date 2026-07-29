package com.civicpulse.officer_service.repository;

import com.civicpulse.officer_service.entity.Officer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OfficerRepository extends JpaRepository<Officer, Long> {

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    boolean existsByOfficerId(String officerId);

    Optional<Officer> findByOfficerId(String officerId);

    Optional<Officer> findByEmail(String email);

    List<Officer> findByDepartment(String department);

    List<Officer> findByDepartmentAndDesignation(
            String department,
            String designation
    );

    List<Officer> findByDepartmentOrderByDesignationAsc(String department);

    long countByDepartment(String department);
}