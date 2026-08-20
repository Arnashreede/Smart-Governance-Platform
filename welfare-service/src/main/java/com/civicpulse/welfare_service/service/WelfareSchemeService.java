package com.civicpulse.welfare_service.service;

import com.civicpulse.welfare_service.dto.WelfareRequest;
import com.civicpulse.welfare_service.dto.WelfareResponse;

import java.util.List;

public interface WelfareSchemeService {

    // Create Scheme
    WelfareResponse createScheme(WelfareRequest request);

    // Update Scheme
    WelfareResponse updateScheme(Long id, WelfareRequest request);

    // Get Scheme by Database ID
    WelfareResponse getScheme(Long id);

    // Get Scheme by Scheme Code
    WelfareResponse getSchemeByCode(String schemeCode);

    // Get All Schemes
    List<WelfareResponse> getAllSchemes();

    // Get Active Schemes
    List<WelfareResponse> getActiveSchemes();

    // Get Schemes by Category
    List<WelfareResponse> getSchemesByCategory(String category);

    // Get Schemes by Department
    List<WelfareResponse> getSchemesByDepartment(String department);

    // Activate Scheme
    WelfareResponse activateScheme(Long id);

    // Deactivate Scheme
    WelfareResponse deactivateScheme(Long id);

    // Delete Scheme
    void deleteScheme(Long id);
}