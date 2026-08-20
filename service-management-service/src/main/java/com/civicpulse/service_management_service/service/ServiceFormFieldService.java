package com.civicpulse.service_management_service.service;

import com.civicpulse.service_management_service.entity.GovernmentService;
import com.civicpulse.service_management_service.entity.ServiceFormField;
import com.civicpulse.service_management_service.repository.ServiceFormFieldRepository;
import com.civicpulse.service_management_service.repository.ServiceRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceFormFieldService {

    private final ServiceFormFieldRepository formFieldRepository;
    private final ServiceRepository serviceRepository;

    public ServiceFormFieldService(
            ServiceFormFieldRepository formFieldRepository,
            ServiceRepository serviceRepository) {

        this.formFieldRepository = formFieldRepository;
        this.serviceRepository = serviceRepository;
    }

    // ============================
    // GET FORM FIELDS
    // ============================

    public List<ServiceFormField> getFormFields(Long serviceId) {

        if (!serviceRepository.existsById(serviceId)) {
            throw new RuntimeException("Service not found");
        }

        return formFieldRepository
                .findByServiceIdOrderByFieldOrderAsc(serviceId);
    }

    // ============================
    // ADD FORM FIELD
    // ============================

    public ServiceFormField addFormField(
            Long serviceId,
            ServiceFormField field) {

        GovernmentService service =
                serviceRepository.findById(serviceId)
                        .orElseThrow(() ->
                                new RuntimeException("Service not found"));

        field.setId(null);
        field.setService(service);

        if (field.getFieldOrder() == null) {

            List<ServiceFormField> existingFields =
                    formFieldRepository
                            .findByServiceIdOrderByFieldOrderAsc(serviceId);

            field.setFieldOrder(existingFields.size() + 1);
        }

        return formFieldRepository.save(field);
    }

    // ============================
    // UPDATE FORM FIELD
    // ============================

    public ServiceFormField updateFormField(
            Long fieldId,
            ServiceFormField updated) {

        ServiceFormField existing =
                formFieldRepository.findById(fieldId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Form field not found"));

        existing.setFieldName(updated.getFieldName());
        existing.setFieldType(updated.getFieldType());
        existing.setRequired(updated.isRequired());
        existing.setPlaceholder(updated.getPlaceholder());
        existing.setOptions(updated.getOptions());
        existing.setFieldOrder(updated.getFieldOrder());

        return formFieldRepository.save(existing);
    }

    // ============================
    // DELETE FORM FIELD
    // ============================

    public void deleteFormField(Long fieldId) {

        if (!formFieldRepository.existsById(fieldId)) {

            throw new RuntimeException(
                    "Form field not found");
        }

        formFieldRepository.deleteById(fieldId);
    }
}