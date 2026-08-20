package com.civicpulse.user_service.repository;

import com.civicpulse.user_service.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

    boolean existsByName(String name);

    boolean existsByDepartmentCode(String departmentCode);

    Optional<Department> findByName(String name);

    Optional<Department> findByDepartmentCode(String departmentCode);
}