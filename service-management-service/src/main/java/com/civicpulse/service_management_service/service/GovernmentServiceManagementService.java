package com.civicpulse.service_management_service.service;

import com.civicpulse.service_management_service.entity.GovernmentService;
import com.civicpulse.service_management_service.repository.ServiceRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GovernmentServiceManagementService {

    private final ServiceRepository serviceRepository;

    public GovernmentServiceManagementService(
            ServiceRepository serviceRepository) {

        this.serviceRepository = serviceRepository;
    }

    // ============================
    // GET ALL SERVICES
    // ============================

    public List<GovernmentService> getAllServices() {

        return serviceRepository.findAll();
    }

    // ============================
    // GET ACTIVE SERVICES
    // ============================

    public List<GovernmentService> getActiveServices() {

        return serviceRepository.findByActiveTrue();
    }

    // ============================
    // GET SERVICES BY DEPARTMENT
    // ============================

    public List<GovernmentService> getServicesByDepartment(
            Long departmentId) {

        return serviceRepository.findByDepartmentId(departmentId);
    }

    // ============================
    // GET SERVICE BY ID
    // ============================

    public GovernmentService getServiceById(Long id) {

        return serviceRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Service not found"));
    }

    // ============================
    // CREATE SERVICE
    // ============================

    public GovernmentService createService(
            GovernmentService service) {

        if (serviceRepository.existsByNameIgnoreCase(
                service.getName())) {

            throw new RuntimeException(
                    "A service with this name already exists."
            );
        }

        service.setActive(true);

        return serviceRepository.save(service);
    }

    // ============================
    // UPDATE SERVICE
    // ============================

    public GovernmentService updateService(
            Long id,
            GovernmentService updated) {

        GovernmentService existing =
                getServiceById(id);

        existing.setName(updated.getName());

        existing.setDepartmentId(
                updated.getDepartmentId()
        );

        existing.setServiceType(
                updated.getServiceType()
        );

        existing.setDescription(
                updated.getDescription()
        );

        existing.setEligibility(
                updated.getEligibility()
        );

        existing.setActive(
                updated.isActive()
        );

        return serviceRepository.save(existing);
    }

    // ============================
    // TOGGLE ACTIVE / INACTIVE
    // ============================

    public GovernmentService toggleService(Long id) {

        GovernmentService service =
                getServiceById(id);

        service.setActive(
                !service.isActive()
        );

        return serviceRepository.save(service);
    }

    // ============================
    // DELETE SERVICE
    // ============================

    public void deleteService(Long id) {

        if (!serviceRepository.existsById(id)) {

            throw new RuntimeException(
                    "Service not found"
            );
        }

        serviceRepository.deleteById(id);
    }
}