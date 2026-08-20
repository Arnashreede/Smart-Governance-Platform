package com.civicpulse.service_management_service.controller;

import com.civicpulse.service_management_service.entity.GovernmentService;
import com.civicpulse.service_management_service.service.GovernmentServiceManagementService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/services")
public class GovernmentServiceController {

    private final GovernmentServiceManagementService serviceManagementService;

    public GovernmentServiceController(
            GovernmentServiceManagementService serviceManagementService) {

        this.serviceManagementService = serviceManagementService;
    }

    // GET ALL SERVICES
    @GetMapping
    public List<GovernmentService> getAllServices() {

        return serviceManagementService.getAllServices();
    }

    // GET ACTIVE SERVICES
    @GetMapping("/active")
    public List<GovernmentService> getActiveServices() {

        return serviceManagementService.getActiveServices();
    }

    // GET SERVICE BY ID
    @GetMapping("/{id}")
    public GovernmentService getService(
            @PathVariable Long id) {

        return serviceManagementService.getServiceById(id);
    }

    // GET SERVICES BY DEPARTMENT
    @GetMapping("/department/{departmentId}")
    public List<GovernmentService> getServicesByDepartment(
            @PathVariable Long departmentId) {

        return serviceManagementService
                .getServicesByDepartment(departmentId);
    }

    // CREATE SERVICE
    @PostMapping
    public GovernmentService createService(
            @RequestBody GovernmentService service) {

        return serviceManagementService
                .createService(service);
    }

    // UPDATE SERVICE
    @PutMapping("/{id}")
    public GovernmentService updateService(
            @PathVariable Long id,
            @RequestBody GovernmentService service) {

        return serviceManagementService
                .updateService(id, service);
    }

    // ACTIVATE / DEACTIVATE SERVICE
    @PutMapping("/{id}/toggle")
    public GovernmentService toggleService(
            @PathVariable Long id) {

        return serviceManagementService
                .toggleService(id);
    }

    // DELETE SERVICE
    @DeleteMapping("/{id}")
    public String deleteService(
            @PathVariable Long id) {

        serviceManagementService.deleteService(id);

        return "Service deleted successfully";
    }
}