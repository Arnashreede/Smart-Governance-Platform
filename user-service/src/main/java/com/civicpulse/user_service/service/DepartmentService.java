package com.civicpulse.user_service.service;

import com.civicpulse.user_service.entity.Department;
import com.civicpulse.user_service.repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    // Get all departments
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    // Get department by ID
    public Optional<Department> getDepartmentById(Long id) {
        return departmentRepository.findById(id);
    }

    // Add department
    public Department addDepartment(Department department) {

        if (departmentRepository.existsByName(department.getName())) {
            throw new RuntimeException("Department already exists.");
        }

        return departmentRepository.save(department);
    }

    // Update department
    public Department updateDepartment(Long id, Department updatedDepartment) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        department.setName(updatedDepartment.getName());
        department.setDescription(updatedDepartment.getDescription());

        return departmentRepository.save(department);
    }

    // Delete department
    public void deleteDepartment(Long id) {

        if (!departmentRepository.existsById(id)) {
            throw new RuntimeException("Department not found");
        }

        departmentRepository.deleteById(id);
    }
}