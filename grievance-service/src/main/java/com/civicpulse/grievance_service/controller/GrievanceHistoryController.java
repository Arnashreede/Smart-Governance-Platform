package com.civicpulse.grievance_service.controller;

import com.civicpulse.grievance_service.entity.GrievanceHistory;
import com.civicpulse.grievance_service.service.GrievanceHistoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/grievances/history")
public class GrievanceHistoryController {

    private final GrievanceHistoryService historyService;

    public GrievanceHistoryController(
            GrievanceHistoryService historyService) {

        this.historyService = historyService;
    }

    @GetMapping("/{grievanceId}")
    public List<GrievanceHistory> getHistory(
            @PathVariable Long grievanceId) {

        return historyService.getHistory(grievanceId);
    }
}