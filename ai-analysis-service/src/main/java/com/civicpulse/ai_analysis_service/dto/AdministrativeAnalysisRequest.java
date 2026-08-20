package com.civicpulse.ai_analysis_service.dto;

import java.util.Map;

public class AdministrativeAnalysisRequest {

    private Map<String, Object> administrativeData;

    public AdministrativeAnalysisRequest() {
    }

    public Map<String, Object> getAdministrativeData() {
        return administrativeData;
    }

    public void setAdministrativeData(
            Map<String, Object> administrativeData) {

        this.administrativeData = administrativeData;
    }
}