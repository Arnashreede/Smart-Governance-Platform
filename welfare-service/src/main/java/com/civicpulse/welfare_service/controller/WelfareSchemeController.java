package com.civicpulse.welfare_service.controller;

import com.civicpulse.welfare_service.dto.WelfareApplicationResponse;
import com.civicpulse.welfare_service.dto.WelfareRequest;
import com.civicpulse.welfare_service.dto.WelfareResponse;
import com.civicpulse.welfare_service.service.WelfareApplicationService;
import com.civicpulse.welfare_service.service.WelfareSchemeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/welfare")
@RequiredArgsConstructor
public class WelfareSchemeController {

    private final WelfareSchemeService welfareSchemeService;
private final WelfareApplicationService welfareApplicationService;
    @PostMapping
    public WelfareResponse createScheme(@RequestBody WelfareRequest request){

        return welfareSchemeService.createScheme(request);
    }

    @GetMapping
    public List<WelfareResponse> getAllSchemes(){

        return welfareSchemeService.getAllSchemes();
    }

    @GetMapping("/{id}")
    public WelfareResponse getScheme(@PathVariable Long id){

        return welfareSchemeService.getScheme(id);
    }

    @PutMapping("/{id}")
    public WelfareResponse updateScheme(@PathVariable Long id,
                                        @RequestBody WelfareRequest request){

        return welfareSchemeService.updateScheme(id,request);
    }

    @DeleteMapping("/{id}")
    public void deleteScheme(@PathVariable Long id){

        welfareSchemeService.deleteScheme(id);
    }
@PutMapping("/{applicationId}/reject")
public WelfareApplicationResponse rejectApplication(
        @PathVariable Long applicationId,
        @RequestParam String rejectionReason) {

    return welfareApplicationService.rejectApplication(
            applicationId,
            rejectionReason);
}
}