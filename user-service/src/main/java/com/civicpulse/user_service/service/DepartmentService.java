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

    // Get department by Name
    public Optional<Department> getDepartmentByName(String name) {
        return departmentRepository.findByName(name);
    }

    // Add Department
    // Add Department
public Department addDepartment(Department department) {

    if (departmentRepository.existsByName(department.getName())) {
        throw new RuntimeException("Department already exists.");
    }

    // Generate department code automatically
    String code = department.getName()
            .replaceAll("[^A-Za-z0-9]", "")
            .toUpperCase();

    String baseCode = code;
    int counter = 1;

    while (departmentRepository.existsByDepartmentCode(code)) {
        code = baseCode + counter++;
    }

    department.setDepartmentCode(code);

    // Generate default contact details
    department.setOfficeEmail(
            code.toLowerCase() + "@civicpulse.com"
    );

    department.setContactNumber("0000000000");

    department.setOfficeAddress("CivicPulse Municipal Office");

    // New departments are active by default
    department.setActive(true);

    return departmentRepository.save(department);
}

    // Update Department
    public Department updateDepartment(Long id, Department updatedDepartment) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        department.setName(updatedDepartment.getName());
        department.setDescription(updatedDepartment.getDescription());
        department.setDepartmentCode(updatedDepartment.getDepartmentCode());
        department.setOfficeEmail(updatedDepartment.getOfficeEmail());
        department.setContactNumber(updatedDepartment.getContactNumber());
        department.setOfficeAddress(updatedDepartment.getOfficeAddress());

        return departmentRepository.save(department);
    }

    // Activate Department
    public Department activateDepartment(Long id) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        department.setActive(true);

        return departmentRepository.save(department);
    }

    // Deactivate Department
    public Department deactivateDepartment(Long id) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        department.setActive(false);

        return departmentRepository.save(department);
    }

    // Delete Department
    public void deleteDepartment(Long id) {

        if (!departmentRepository.existsById(id)) {
            throw new RuntimeException("Department not found");
        }

        departmentRepository.deleteById(id);
    }
}