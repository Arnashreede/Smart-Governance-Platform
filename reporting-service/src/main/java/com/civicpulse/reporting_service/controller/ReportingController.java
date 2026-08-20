package com.civicpulse.reporting_service.controller;

import com.civicpulse.reporting_service.entity.CitizenReport;
import com.civicpulse.reporting_service.entity.GrievanceReport;
import com.civicpulse.reporting_service.service.ReportingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.civicpulse.reporting_service.dto.DashboardResponse;
import com.civicpulse.reporting_service.dto.CitizenDashboardResponse;
@RestController
@RequestMapping("/reports")
public class ReportingController {

    private final ReportingService reportingService;

    public ReportingController(ReportingService reportingService) {
        this.reportingService = reportingService;
    }

    @GetMapping("/citizens")
    public List<CitizenReport> getCitizens() {
        return reportingService.getAllCitizens();
    }
@GetMapping("/dashboard/citizen/{citizenId}")
public CitizenDashboardResponse getCitizenDashboard(
        @PathVariable Long citizenId) {
    return reportingService.getCitizenDashboard(citizenId);
}
    @GetMapping("/grievances")
    public List<GrievanceReport> getGrievances() {
        return reportingService.getAllGrievances();
    }

    @GetMapping("/dashboard")
public DashboardResponse dashboard() {
    return reportingService.getDashboard();
}
@GetMapping("/citizens/count")
public long getCitizenCount() {
    return reportingService.getCitizenCount();
}

}