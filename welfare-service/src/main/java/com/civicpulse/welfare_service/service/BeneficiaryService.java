package com.civicpulse.welfare_service.service;

import com.civicpulse.welfare_service.dto.BeneficiaryResponse;

import java.util.List;

public interface BeneficiaryService {

    List<BeneficiaryResponse> getAllBeneficiaries();

    List<BeneficiaryResponse> getCitizenBeneficiaries(Long citizenId);

    BeneficiaryResponse issueBenefit(Long beneficiaryId);

}