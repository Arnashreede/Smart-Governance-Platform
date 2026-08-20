package com.civicpulse.welfare_service.service.impl;

import com.civicpulse.welfare_service.dto.BeneficiaryResponse;
import com.civicpulse.welfare_service.entity.Beneficiary;
import com.civicpulse.welfare_service.entity.WelfareScheme;
import com.civicpulse.welfare_service.repository.BeneficiaryRepository;
import com.civicpulse.welfare_service.repository.WelfareSchemeRepository;
import com.civicpulse.welfare_service.service.BeneficiaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.civicpulse.welfare_service.event.BenefitIssuedEvent;
import com.civicpulse.welfare_service.kafka.WelfareEventProducer;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BeneficiaryServiceImpl implements BeneficiaryService {

    private final BeneficiaryRepository beneficiaryRepository;
private final WelfareSchemeRepository schemeRepository;
private final WelfareEventProducer welfareEventProducer;

    @Override
    public List<BeneficiaryResponse> getAllBeneficiaries() {

        return beneficiaryRepository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public List<BeneficiaryResponse> getCitizenBeneficiaries(Long citizenId) {

        return beneficiaryRepository.findByCitizenId(citizenId)
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public BeneficiaryResponse issueBenefit(Long beneficiaryId) {

        Beneficiary beneficiary = beneficiaryRepository.findById(beneficiaryId)
                .orElseThrow(() ->
                        new RuntimeException("Beneficiary not found"));

        if (Boolean.TRUE.equals(beneficiary.getBenefitIssued())) {
            throw new RuntimeException("Benefit has already been issued.");
        }

        beneficiary.setBenefitIssued(true);
        beneficiary.setBenefitIssuedAt(LocalDateTime.now());

        WelfareScheme scheme = beneficiary.getWelfareScheme();

        BigDecimal currentUtilized = scheme.getUtilizedBudget() == null
                ? BigDecimal.ZERO
                : scheme.getUtilizedBudget();

        BigDecimal benefitAmount = beneficiary.getBenefitAmount() == null
                ? BigDecimal.ZERO
                : beneficiary.getBenefitAmount();

        scheme.setUtilizedBudget(
        currentUtilized.add(benefitAmount)
);

schemeRepository.save(scheme);
beneficiaryRepository.save(beneficiary);

// =========================================================
// PUBLISH BENEFIT ISSUED EVENT
// =========================================================

BenefitIssuedEvent event =
        new BenefitIssuedEvent(
                beneficiary.getId(),
                beneficiary.getCitizenId(),
                beneficiary.getWelfareApplication().getId(),
                scheme.getBudgetId(),
                scheme.getSchemeName(),
                benefitAmount.doubleValue()
        );

welfareEventProducer.publishBenefitIssued(event);

return map(beneficiary);
    }

    private BeneficiaryResponse map(Beneficiary beneficiary) {

        return BeneficiaryResponse.builder()
                .id(beneficiary.getId())
                .citizenId(beneficiary.getCitizenId())
                .fullName(beneficiary.getFullName())
                .schemeName(beneficiary.getWelfareScheme().getSchemeName())
                .district(beneficiary.getDistrict())
                .occupation(beneficiary.getOccupation())
                .annualIncome(beneficiary.getAnnualIncome())
                .benefitAmount(beneficiary.getBenefitAmount())
                .benefitIssued(beneficiary.getBenefitIssued())
                .approvedAt(
                        beneficiary.getApprovedAt() != null
                                ? beneficiary.getApprovedAt().toString()
                                : null
                )
                .benefitIssuedAt(
                        beneficiary.getBenefitIssuedAt() != null
                                ? beneficiary.getBenefitIssuedAt().toString()
                                : null
                )
                .build();
    }
}