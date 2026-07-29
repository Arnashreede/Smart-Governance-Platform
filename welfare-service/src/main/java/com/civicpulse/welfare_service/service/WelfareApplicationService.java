package com.civicpulse.welfare_service.service;

import com.civicpulse.welfare_service.dto.WelfareApplicationRequest;
import com.civicpulse.welfare_service.dto.WelfareApplicationResponse;

import java.util.List;

public interface WelfareApplicationService {

    WelfareApplicationResponse applyForScheme(WelfareApplicationRequest request);

    List<WelfareApplicationResponse> getAllApplications();

    List<WelfareApplicationResponse> getCitizenApplications(Long citizenId);

    WelfareApplicationResponse approveApplication(Long applicationId);

    WelfareApplicationResponse rejectApplication(Long applicationId);
}