package com.civicpulse.welfare_service.service;

import com.civicpulse.welfare_service.dto.WelfareRequest;
import com.civicpulse.welfare_service.dto.WelfareResponse;

import java.util.List;

public interface WelfareSchemeService {

    WelfareResponse createScheme(WelfareRequest request);

    WelfareResponse updateScheme(Long id,WelfareRequest request);

    WelfareResponse getScheme(Long id);

    List<WelfareResponse> getAllSchemes();

    void deleteScheme(Long id);

}