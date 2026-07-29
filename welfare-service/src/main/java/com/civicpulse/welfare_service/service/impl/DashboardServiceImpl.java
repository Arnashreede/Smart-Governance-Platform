package com.civicpulse.welfare_service.service.impl;

import com.civicpulse.welfare_service.dto.DashboardResponse;
import com.civicpulse.welfare_service.entity.ApplicationStatus;
import com.civicpulse.welfare_service.entity.WelfareScheme;
import com.civicpulse.welfare_service.repository.BeneficiaryRepository;
import com.civicpulse.welfare_service.repository.WelfareApplicationRepository;
import com.civicpulse.welfare_service.repository.WelfareSchemeRepository;
import com.civicpulse.welfare_service.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final WelfareSchemeRepository schemeRepository;
    private final WelfareApplicationRepository applicationRepository;
    private final BeneficiaryRepository beneficiaryRepository;

    @Override
    public DashboardResponse getDashboard() {

        List<WelfareScheme> schemes = schemeRepository.findAll();

        BigDecimal allocatedBudget = BigDecimal.ZERO;
        BigDecimal utilizedBudget = BigDecimal.ZERO;

        for (WelfareScheme scheme : schemes) {

            if (scheme.getAllocatedBudget() != null) {
                allocatedBudget = allocatedBudget.add(scheme.getAllocatedBudget());
            }

            if (scheme.getUtilizedBudget() != null) {
                utilizedBudget = utilizedBudget.add(scheme.getUtilizedBudget());
            }
        }

        return DashboardResponse.builder()
                .totalSchemes(schemeRepository.count())
                .activeSchemes(schemeRepository.countByActiveTrue())

                .totalApplications(applicationRepository.count())
                .approvedApplications(applicationRepository.countByStatus(ApplicationStatus.APPROVED))
                .pendingApplications(applicationRepository.countByStatus(ApplicationStatus.PENDING))
                .rejectedApplications(applicationRepository.countByStatus(ApplicationStatus.REJECTED))

                .totalBeneficiaries(beneficiaryRepository.count())

                .allocatedBudget(allocatedBudget)
                .utilizedBudget(utilizedBudget)
                .remainingBudget(allocatedBudget.subtract(utilizedBudget))

                .build();
    }
}