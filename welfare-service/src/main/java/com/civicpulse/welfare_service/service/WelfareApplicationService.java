package com.civicpulse.welfare_service.service;

import com.civicpulse.welfare_service.dto.WelfareApplicationRequest;
import com.civicpulse.welfare_service.dto.WelfareApplicationResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface WelfareApplicationService {

    WelfareApplicationResponse applyForScheme(
            WelfareApplicationRequest request,
            List<MultipartFile> documents);

    List<WelfareApplicationResponse> getAllApplications();

    List<WelfareApplicationResponse> getCitizenApplications(Long citizenId);

    WelfareApplicationResponse getApplicationById(Long applicationId);

    WelfareApplicationResponse approveApplication(Long applicationId);

    WelfareApplicationResponse rejectApplication(
            Long applicationId,
            String rejectionReason);

    List<WelfareApplicationResponse> getRejectedApplications();
    List<WelfareApplicationResponse> getApplicationsByDepartment(
        String department
);
}