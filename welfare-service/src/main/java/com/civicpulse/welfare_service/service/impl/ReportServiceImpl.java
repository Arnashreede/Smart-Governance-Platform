package com.civicpulse.welfare_service.service.impl;

import com.civicpulse.welfare_service.dto.ReportResponse;
import com.civicpulse.welfare_service.entity.ApplicationStatus;
import com.civicpulse.welfare_service.entity.WelfareScheme;
import com.civicpulse.welfare_service.repository.BeneficiaryRepository;
import com.civicpulse.welfare_service.repository.WelfareApplicationRepository;
import com.civicpulse.welfare_service.repository.WelfareSchemeRepository;
import com.civicpulse.welfare_service.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final WelfareSchemeRepository schemeRepository;
    private final WelfareApplicationRepository applicationRepository;
    private final BeneficiaryRepository beneficiaryRepository;

    @Override
    public List<ReportResponse> getSchemeReports() {

        return schemeRepository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }

    private ReportResponse map(WelfareScheme scheme) {

        BigDecimal allocated = scheme.getAllocatedBudget() == null
                ? BigDecimal.ZERO
                : scheme.getAllocatedBudget();

        BigDecimal utilized = scheme.getUtilizedBudget() == null
                ? BigDecimal.ZERO
                : scheme.getUtilizedBudget();

        return ReportResponse.builder()
                .schemeId(scheme.getId())
                .schemeName(scheme.getSchemeName())

                .totalApplications(
                        applicationRepository.countByWelfareSchemeId(scheme.getId()))

                .approvedApplications(
                        applicationRepository.countByWelfareSchemeIdAndStatus(
                                scheme.getId(),
                                ApplicationStatus.APPROVED))

                .pendingApplications(
                        applicationRepository.countByWelfareSchemeIdAndStatus(
                                scheme.getId(),
                                ApplicationStatus.PENDING))

                .rejectedApplications(
                        applicationRepository.countByWelfareSchemeIdAndStatus(
                                scheme.getId(),
                                ApplicationStatus.REJECTED))

                .totalBeneficiaries(
                        beneficiaryRepository.countByWelfareSchemeId(scheme.getId()))

                .allocatedBudget(allocated)
                .utilizedBudget(utilized)
                .remainingBudget(allocated.subtract(utilized))
                .build();
    }
}