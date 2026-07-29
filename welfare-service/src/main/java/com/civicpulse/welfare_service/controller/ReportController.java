package com.civicpulse.welfare_service.controller;

import com.civicpulse.welfare_service.dto.ReportResponse;
import com.civicpulse.welfare_service.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping
    public List<ReportResponse> getReports() {
        return reportService.getSchemeReports();
    }
}