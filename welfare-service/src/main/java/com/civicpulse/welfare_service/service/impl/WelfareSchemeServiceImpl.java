package com.civicpulse.welfare_service.service.impl;

import com.civicpulse.welfare_service.dto.WelfareRequest;
import com.civicpulse.welfare_service.dto.WelfareResponse;
import com.civicpulse.welfare_service.entity.WelfareScheme;
import com.civicpulse.welfare_service.repository.WelfareSchemeRepository;
import com.civicpulse.welfare_service.service.WelfareSchemeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WelfareSchemeServiceImpl implements WelfareSchemeService {

    private final WelfareSchemeRepository repository;

    private String generateSchemeCode() {

        long count = repository.count() + 1;

        return "WEL-" + Year.now().getValue() + "-"
                + String.format("%04d", count);
    }

    @Override
    public WelfareResponse createScheme(WelfareRequest request) {

        if (repository.existsBySchemeName(request.getSchemeName())) {
            throw new RuntimeException("Scheme already exists");
        }

        WelfareScheme scheme = WelfareScheme.builder()
                .schemeCode(generateSchemeCode())
                .schemeName(request.getSchemeName())
                .schemeType(request.getSchemeType())
                .department(request.getDepartment())
                .description(request.getDescription())
                .category(request.getCategory())
                .eligibilityCriteria(request.getEligibilityCriteria())
                .requiredDocuments(request.getRequiredDocuments())
                .benefitAmount(request.getBenefitAmount())
                .allocatedBudget(request.getAllocatedBudget())
                .budgetId(request.getBudgetId())
                .maxBeneficiaries(request.getMaxBeneficiaries())
                .maxIncome(request.getMaxIncome())
                .minimumAge(request.getMinimumAge())
                .maximumAge(request.getMaximumAge())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .active(request.getActive())
                .createdAt(LocalDateTime.now())
                .build();

        repository.save(scheme);

        return map(scheme);
    }
        @Override
    public WelfareResponse updateScheme(Long id, WelfareRequest request) {

        WelfareScheme scheme = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Scheme not found"));

        scheme.setSchemeName(request.getSchemeName());
        scheme.setSchemeType(request.getSchemeType());
        scheme.setDepartment(request.getDepartment());
        scheme.setDescription(request.getDescription());
        scheme.setCategory(request.getCategory());
        scheme.setEligibilityCriteria(request.getEligibilityCriteria());
        scheme.setRequiredDocuments(request.getRequiredDocuments());

        scheme.setBenefitAmount(request.getBenefitAmount());
        scheme.setAllocatedBudget(request.getAllocatedBudget());
        scheme.setBudgetId(request.getBudgetId());

        scheme.setMaxBeneficiaries(request.getMaxBeneficiaries());
        scheme.setMaxIncome(request.getMaxIncome());
        scheme.setMinimumAge(request.getMinimumAge());
        scheme.setMaximumAge(request.getMaximumAge());

        scheme.setStartDate(request.getStartDate());
        scheme.setEndDate(request.getEndDate());

       
        scheme.setActive(request.getActive());

        scheme.setUpdatedAt(LocalDateTime.now());

        repository.save(scheme);

        return map(scheme);
    }

    @Override
    public WelfareResponse getScheme(Long id) {

        WelfareScheme scheme = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Scheme not found"));

        return map(scheme);
    }

    @Override
    public List<WelfareResponse> getAllSchemes() {

        return repository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }
@Override
public WelfareResponse getSchemeByCode(String schemeCode) {

    WelfareScheme scheme = repository.findBySchemeCode(schemeCode)
            .orElseThrow(() -> new RuntimeException("Scheme not found"));

    return map(scheme);
}

@Override
public List<WelfareResponse> getActiveSchemes() {

    return repository.findByActiveTrue()
            .stream()
            .map(this::map)
            .toList();
}

@Override
public List<WelfareResponse> getSchemesByCategory(String category) {

    return repository.findByCategory(category)
            .stream()
            .map(this::map)
            .toList();
}

@Override
public List<WelfareResponse> getSchemesByDepartment(String department) {

    return repository.findByDepartment(department)
            .stream()
            .map(this::map)
            .toList();
}

@Override
public WelfareResponse activateScheme(Long id) {

    WelfareScheme scheme = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Scheme not found"));

    scheme.setActive(true);
    repository.save(scheme);

    return map(scheme);
}

@Override
public WelfareResponse deactivateScheme(Long id) {

    WelfareScheme scheme = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Scheme not found"));

    scheme.setActive(false);
    repository.save(scheme);

    return map(scheme);
}
    @Override
    public void deleteScheme(Long id) {

        WelfareScheme scheme = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Scheme not found"));

        repository.delete(scheme);
    }
    
        private WelfareResponse map(WelfareScheme scheme) {

        return WelfareResponse.builder()
                .id(scheme.getId())
                .schemeCode(scheme.getSchemeCode())
                .schemeName(scheme.getSchemeName())
                .schemeType(scheme.getSchemeType())
                .department(scheme.getDepartment())
                .description(scheme.getDescription())
                .category(scheme.getCategory())
                .eligibilityCriteria(scheme.getEligibilityCriteria())
                .requiredDocuments(scheme.getRequiredDocuments())

                .benefitAmount(scheme.getBenefitAmount())
                .allocatedBudget(scheme.getAllocatedBudget())
                .budgetId(scheme.getBudgetId())
                .utilizedBudget(scheme.getUtilizedBudget())

                .maxBeneficiaries(scheme.getMaxBeneficiaries())
                .maxIncome(scheme.getMaxIncome())
                .minimumAge(scheme.getMinimumAge())
                .maximumAge(scheme.getMaximumAge())

                .startDate(scheme.getStartDate())
                .endDate(scheme.getEndDate())

                
                .active(scheme.getActive())

                .createdAt(scheme.getCreatedAt())
                .updatedAt(scheme.getUpdatedAt())

                .build();
    }
}