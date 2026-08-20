package com.civicpulse.service_management_service.controller;

import com.civicpulse.service_management_service.entity.ServiceFormField;
import com.civicpulse.service_management_service.service.ServiceFormFieldService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/services")
public class ServiceFormFieldController {

    private final ServiceFormFieldService formFieldService;

    public ServiceFormFieldController(
            ServiceFormFieldService formFieldService) {

        this.formFieldService = formFieldService;
    }

    // ============================
    // GET FORM FIELDS FOR A SERVICE
    // ============================

    @GetMapping("/{serviceId}/form-fields")
    public List<ServiceFormField> getFormFields(
            @PathVariable Long serviceId) {

        return formFieldService.getFormFields(serviceId);
    }

    // ============================
    // ADD FORM FIELD
    // ============================

    @PostMapping("/{serviceId}/form-fields")
    public ServiceFormField addFormField(
            @PathVariable Long serviceId,
            @RequestBody ServiceFormField field) {

        return formFieldService.addFormField(
                serviceId,
                field
        );
    }

    // ============================
    // UPDATE FORM FIELD
    // ============================

    @PutMapping("/form-fields/{fieldId}")
    public ServiceFormField updateFormField(
            @PathVariable Long fieldId,
            @RequestBody ServiceFormField field) {

        return formFieldService.updateFormField(
                fieldId,
                field
        );
    }

    // ============================
    // DELETE FORM FIELD
    // ============================

    @DeleteMapping("/form-fields/{fieldId}")
    public String deleteFormField(
            @PathVariable Long fieldId) {

        formFieldService.deleteFormField(fieldId);

        return "Form field deleted successfully";
    }
}