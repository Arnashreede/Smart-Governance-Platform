package com.civicpulse.welfare_service.service.impl;

import com.civicpulse.welfare_service.client.BudgetClient;
import com.civicpulse.welfare_service.dto.WelfareApplicationRequest;
import com.civicpulse.welfare_service.dto.WelfareApplicationResponse;
import com.civicpulse.welfare_service.entity.*;
import com.civicpulse.welfare_service.repository.BeneficiaryRepository;
import com.civicpulse.welfare_service.repository.WelfareApplicationRepository;
import com.civicpulse.welfare_service.repository.WelfareSchemeRepository;
import com.civicpulse.welfare_service.service.WelfareApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.civicpulse.welfare_service.dto.FundDistributionRequest;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WelfareApplicationServiceImpl
        implements WelfareApplicationService {
private final BudgetClient budgetClient;
    private final WelfareApplicationRepository applicationRepository;
    private final WelfareSchemeRepository schemeRepository;
private final BeneficiaryRepository beneficiaryRepository;
    @Override
    public WelfareApplicationResponse applyForScheme(WelfareApplicationRequest request) {

        WelfareScheme scheme = schemeRepository.findById(request.getSchemeId())
                .orElseThrow(() ->
                        new RuntimeException("Welfare Scheme not found"));

        boolean alreadyApplied =
                applicationRepository.existsByCitizenIdAndWelfareSchemeId(
                        request.getCitizenId(),
                        request.getSchemeId());

        if (alreadyApplied) {
            throw new RuntimeException(
                    "You have already applied for this scheme.");
        }

        EligibilityStatus eligibility;

        if (request.getAnnualIncome() <= scheme.getMaxIncome().doubleValue()
                && request.getAge() >= scheme.getMinimumAge()
                && request.getAge() <= scheme.getMaximumAge()) {

            eligibility = EligibilityStatus.ELIGIBLE;

        } else {

            eligibility = EligibilityStatus.NOT_ELIGIBLE;

        }

        WelfareApplication application =
                WelfareApplication.builder()
                        .citizenId(request.getCitizenId())
                        .welfareScheme(scheme)
                        .fullName(request.getFullName())
                        .age(request.getAge())
                        .district(request.getDistrict())
                        .occupation(request.getOccupation())
                        .annualIncome(request.getAnnualIncome())
                        .remarks(request.getRemarks())
                        .status(ApplicationStatus.PENDING)
                        .eligibilityStatus(eligibility)
                        .appliedAt(LocalDateTime.now())
                        .build();

        applicationRepository.save(application);

        return map(application);

    }

    @Override
    public List<WelfareApplicationResponse> getAllApplications() {

        return applicationRepository.findAll()
                .stream()
                .map(this::map)
                .toList();

    }

    @Override
    public List<WelfareApplicationResponse> getCitizenApplications(Long citizenId) {

        return applicationRepository.findByCitizenId(citizenId)
                .stream()
                .map(this::map)
                .toList();

    }

   @Override
public WelfareApplicationResponse approveApplication(Long applicationId) {

    WelfareApplication application =
            applicationRepository.findById(applicationId)
                    .orElseThrow(() ->
                            new RuntimeException("Application not found"));

    application.setStatus(ApplicationStatus.APPROVED);

    applicationRepository.save(application);

    if (!beneficiaryRepository.existsByWelfareApplicationId(applicationId)) {

        Beneficiary beneficiary = Beneficiary.builder()
                .citizenId(application.getCitizenId())
                .welfareScheme(application.getWelfareScheme())
                .welfareApplication(application)
                .fullName(application.getFullName())
                .district(application.getDistrict())
                .occupation(application.getOccupation())
                .annualIncome(application.getAnnualIncome())
                .benefitAmount(application.getWelfareScheme().getBenefitAmount())
                .remarks(application.getRemarks())
                .approvedAt(LocalDateTime.now())
                .benefitIssued(false)
                .build();

        beneficiaryRepository.save(beneficiary);

        // -------- Call Budget Service --------
        FundDistributionRequest request = new FundDistributionRequest();

        request.setSchemeId(application.getWelfareScheme().getId());
        request.setSchemeName(application.getWelfareScheme().getSchemeName());
        request.setCitizenId(application.getCitizenId());
        request.setBeneficiaryName(application.getFullName());
        request.setAmount(application.getWelfareScheme().getBenefitAmount());

        budgetClient.distributeFunds(
                application.getWelfareScheme().getBudgetId(),
                request
        );
    }

    return map(application);
}

    @Override
    public WelfareApplicationResponse rejectApplication(Long applicationId) {

        WelfareApplication application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException("Application not found"));

        application.setStatus(ApplicationStatus.REJECTED);

        applicationRepository.save(application);

        return map(application);

    }

    private WelfareApplicationResponse map(WelfareApplication application) {

        return WelfareApplicationResponse.builder()
                .id(application.getId())
                .citizenId(application.getCitizenId())
                .schemeId(application.getWelfareScheme().getId())
                .schemeName(application.getWelfareScheme().getSchemeName())
                .fullName(application.getFullName())
                .age(application.getAge())
                .district(application.getDistrict())
                .occupation(application.getOccupation())
                .annualIncome(application.getAnnualIncome())
                .remarks(application.getRemarks())
                .status(application.getStatus().name())
                .eligibilityStatus(application.getEligibilityStatus().name())
                .appliedAt(application.getAppliedAt().toString())
                .build();

    }
}