package com.civicpulse.welfare_service.controller;

import com.civicpulse.welfare_service.dto.BeneficiaryResponse;
import com.civicpulse.welfare_service.service.BeneficiaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/beneficiaries")
@RequiredArgsConstructor
public class BeneficiaryController {

    private final BeneficiaryService beneficiaryService;

    @GetMapping
    public List<BeneficiaryResponse> getAllBeneficiaries() {

        return beneficiaryService.getAllBeneficiaries();
    }

    @GetMapping("/citizen/{citizenId}")
    public List<BeneficiaryResponse> getCitizenBeneficiaries(
            @PathVariable Long citizenId) {

        return beneficiaryService.getCitizenBeneficiaries(citizenId);
    }

    @PutMapping("/{beneficiaryId}/issue")
    public BeneficiaryResponse issueBenefit(
            @PathVariable Long beneficiaryId) {

        return beneficiaryService.issueBenefit(beneficiaryId);
    }
}