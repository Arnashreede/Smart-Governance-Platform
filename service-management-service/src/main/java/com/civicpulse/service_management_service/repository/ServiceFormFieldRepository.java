package com.civicpulse.service_management_service.repository;

import com.civicpulse.service_management_service.entity.ServiceFormField;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceFormFieldRepository
        extends JpaRepository<ServiceFormField, Long> {

    List<ServiceFormField> findByServiceIdOrderByFieldOrderAsc(Long serviceId);

}