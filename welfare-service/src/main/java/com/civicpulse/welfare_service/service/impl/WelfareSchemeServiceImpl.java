package com.civicpulse.welfare_service.service.impl;

import com.civicpulse.welfare_service.dto.WelfareRequest;
import com.civicpulse.welfare_service.dto.WelfareResponse;
import com.civicpulse.welfare_service.entity.WelfareScheme;
import com.civicpulse.welfare_service.repository.WelfareSchemeRepository;
import com.civicpulse.welfare_service.service.WelfareSchemeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WelfareSchemeServiceImpl implements WelfareSchemeService {

    private final WelfareSchemeRepository repository;

    @Override
    public WelfareResponse createScheme(WelfareRequest request) {

        if (repository.existsBySchemeName(request.getSchemeName())) {
            throw new RuntimeException("Scheme already exists");
        }

        WelfareScheme scheme = WelfareScheme.builder()
                .schemeName(request.getSchemeName())
                .department(request.getDepartment())
                .description(request.getDescription())
                .category(request.getCategory())
                .benefitAmount(request.getBenefitAmount())
                .allocatedBudget(request.getAllocatedBudget())
                .budgetId(request.getBudgetId())
                .maxBeneficiaries(request.getMaxBeneficiaries())
                .maxIncome(request.getMaxIncome())
                .minimumAge(request.getMinimumAge())
                .maximumAge(request.getMaximumAge())
                .eligibilityCriteria(request.getEligibilityCriteria())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .active(request.getActive())
                .build();

        repository.save(scheme);

        return map(scheme);
    }

    @Override
    public WelfareResponse updateScheme(Long id, WelfareRequest request) {

        WelfareScheme scheme = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Scheme not found"));

        scheme.setSchemeName(request.getSchemeName());
        scheme.setDepartment(request.getDepartment());
        scheme.setDescription(request.getDescription());
        scheme.setCategory(request.getCategory());
        scheme.setBenefitAmount(request.getBenefitAmount());
        scheme.setAllocatedBudget(request.getAllocatedBudget());
        scheme.setBudgetId(request.getBudgetId());
        scheme.setMaxBeneficiaries(request.getMaxBeneficiaries());
        scheme.setMaxIncome(request.getMaxIncome());
        scheme.setMinimumAge(request.getMinimumAge());
        scheme.setMaximumAge(request.getMaximumAge());
        scheme.setEligibilityCriteria(request.getEligibilityCriteria());
        scheme.setStartDate(request.getStartDate());
        scheme.setEndDate(request.getEndDate());
        scheme.setActive(request.getActive());

        repository.save(scheme);

        return map(scheme);
    }

    @Override
    public WelfareResponse getScheme(Long id) {

        return map(repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Scheme not found")));
    }

    @Override
    public List<WelfareResponse> getAllSchemes() {

        return repository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public void deleteScheme(Long id) {

        repository.deleteById(id);
    }

    private WelfareResponse map(WelfareScheme scheme) {

        return WelfareResponse.builder()
                .id(scheme.getId())
                .schemeName(scheme.getSchemeName())
                .department(scheme.getDepartment())
                .description(scheme.getDescription())
                .category(scheme.getCategory())
                .benefitAmount(scheme.getBenefitAmount())
                .allocatedBudget(scheme.getAllocatedBudget())
                .budgetId(scheme.getBudgetId())
                .maxBeneficiaries(scheme.getMaxBeneficiaries())
                .maxIncome(scheme.getMaxIncome())
                .minimumAge(scheme.getMinimumAge())
                .maximumAge(scheme.getMaximumAge())
                .eligibilityCriteria(scheme.getEligibilityCriteria())
                .startDate(scheme.getStartDate())
                .endDate(scheme.getEndDate())
                .active(scheme.getActive())
                .build();
    }
}