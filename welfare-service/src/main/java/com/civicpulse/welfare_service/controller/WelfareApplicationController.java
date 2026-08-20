package com.civicpulse.welfare_service.controller;

import com.civicpulse.welfare_service.dto.WelfareApplicationRequest;
import com.civicpulse.welfare_service.dto.WelfareApplicationResponse;
import com.civicpulse.welfare_service.service.WelfareApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

import java.util.List;

@RestController
@RequestMapping("/applications")
@RequiredArgsConstructor
public class WelfareApplicationController {

    private final WelfareApplicationService welfareApplicationService;


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
        @PathVariable Long applicationId,
        @RequestParam String reason) {

    return welfareApplicationService.rejectApplication(applicationId, reason);
}
@GetMapping("/{applicationId}")
public WelfareApplicationResponse getApplicationById(
        @PathVariable Long applicationId) {

    return welfareApplicationService.getApplicationById(applicationId);
}
@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public WelfareApplicationResponse applyScheme(
        @RequestPart("application") WelfareApplicationRequest request,
        @RequestPart(value = "documents", required = false) List<MultipartFile> documents) {

    return welfareApplicationService.applyForScheme(request, documents);
}
@GetMapping("/department/{department}")
public List<WelfareApplicationResponse> getApplicationsByDepartment(
        @PathVariable String department) {

    return welfareApplicationService
            .getApplicationsByDepartment(department);
}

}