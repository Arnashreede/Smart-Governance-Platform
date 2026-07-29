package com.civicpulse.welfare_service.service;

import com.civicpulse.welfare_service.dto.ReportResponse;

import java.util.List;

public interface ReportService {

    List<ReportResponse> getSchemeReports();

}