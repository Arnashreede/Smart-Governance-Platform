package com.civicpulse.welfare_service.controller;

import com.civicpulse.welfare_service.dto.WelfareApplicationRequest;
import com.civicpulse.welfare_service.dto.WelfareApplicationResponse;
import com.civicpulse.welfare_service.service.WelfareApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/applications")
@RequiredArgsConstructor
public class WelfareApplicationController {

    private final WelfareApplicationService welfareApplicationService;

    @PostMapping
    public WelfareApplicationResponse applyForScheme(
            @RequestBody WelfareApplicationRequest request) {

        return welfareApplicationService.applyForScheme(request);
    }

    @GetMapping
    public List<WelfareApplicationResponse> getAllApplications() {

        return welfareApplicationService.getAllApplications();
    }

    @GetMapping("/citizen/{citizenId}")
    public List<WelfareApplicationResponse> getCitizenApplications(
            @PathVariable Long citizenId) {

        return welfareApplicationService.getCitizenApplications(citizenId);
    }

    @PutMapping("/{applicationId}/approve")
    public WelfareApplicationResponse approveApplication(
            @PathVariable Long applicationId) {

        return welfareApplicationService.approveApplication(applicationId);
    }

    @PutMapping("/{applicationId}/reject")
    public WelfareApplicationResponse rejectApplication(
            @PathVariable Long applicationId) {

        return welfareApplicationService.rejectApplication(applicationId);
    }
}