package com.civicpulse.user_service.controller;

import com.civicpulse.user_service.entity.Department;
import com.civicpulse.user_service.service.DepartmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/departments")
//@CrossOrigin(origins = "http://localhost:5173")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    // Get All Departments
    @GetMapping
    public List<Department> getAllDepartments() {
        return departmentService.getAllDepartments();
    }

    // Get Department By ID
    @GetMapping("/{id}")
    public ResponseEntity<Department> getDepartmentById(@PathVariable Long id) {

        return departmentService.getDepartmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get Department By Name
    @GetMapping("/name/{name}")
    public ResponseEntity<Department> getDepartmentByName(
            @PathVariable String name) {

        return departmentService.getDepartmentByName(name)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create Department
    @PostMapping
    public Department addDepartment(@RequestBody Department department) {
        return departmentService.addDepartment(department);
    }

    // Update Department
    @PutMapping("/{id}")
    public Department updateDepartment(
            @PathVariable Long id,
            @RequestBody Department department) {

        return departmentService.updateDepartment(id, department);
    }

    // Activate Department
    @PutMapping("/{id}/activate")
    public Department activateDepartment(@PathVariable Long id) {
        return departmentService.activateDepartment(id);
    }

    // Deactivate Department
    @PutMapping("/{id}/deactivate")
    public Department deactivateDepartment(@PathVariable Long id) {
        return departmentService.deactivateDepartment(id);
    }

    // Delete Department
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDepartment(
            @PathVariable Long id) {

        departmentService.deleteDepartment(id);

        return ResponseEntity.ok("Department deleted successfully.");
    }

}