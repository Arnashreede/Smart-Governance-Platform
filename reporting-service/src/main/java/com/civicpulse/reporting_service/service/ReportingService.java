package com.civicpulse.reporting_service.service;

import com.civicpulse.reporting_service.dto.BudgetDashboardResponse;
import com.civicpulse.reporting_service.dto.CitizenDashboardResponse;
import com.civicpulse.reporting_service.dto.DashboardResponse;
import com.civicpulse.reporting_service.entity.CitizenReport;
import com.civicpulse.reporting_service.entity.GrievanceReport;
import com.civicpulse.reporting_service.repository.CitizenReportRepository;
import com.civicpulse.reporting_service.repository.GrievanceReportRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class ReportingService {

    private final CitizenReportRepository citizenRepository;
    private final GrievanceReportRepository grievanceRepository;
    private final RestTemplate restTemplate;

    public ReportingService(
            CitizenReportRepository citizenRepository,
            GrievanceReportRepository grievanceRepository,
            RestTemplate restTemplate) {

        this.citizenRepository = citizenRepository;
        this.grievanceRepository = grievanceRepository;
        this.restTemplate = restTemplate;
    }

    // =========================================================
    // GET ALL CITIZENS
    // =========================================================

    public List<CitizenReport> getAllCitizens() {
        return citizenRepository.findAll();
    }

    // =========================================================
    // GET ALL GRIEVANCES
    // =========================================================

    public List<GrievanceReport> getAllGrievances() {
        return grievanceRepository.findAll();
    }

    // =========================================================
    // DASHBOARD
    // =========================================================

    public DashboardResponse getDashboard() {

        long totalCertificates = 0;
        long totalOfficers = 0;
        long totalDepartments = 0;
        long totalApplications = 0;

        long totalCitizens = 0;
        long totalGrievances = 0;
        long openGrievances = 0;
        long highPriorityGrievances = 0;
        long escalatedGrievances = 0;

        BudgetDashboardResponse budget = new BudgetDashboardResponse();

        // =========================================================
        // CERTIFICATES
        // =========================================================

        try {

            Long count = restTemplate.getForObject(
                    "http://certificate-service/certificates/count",
                    Long.class
            );

            if (count != null) {
                totalCertificates = count;
            }

        } catch (Exception e) {

            totalCertificates = 0;

        }

        // =========================================================
        // OFFICERS
        // =========================================================

        try {

            Long officerCount = restTemplate.getForObject(
                    "http://OFFICER-SERVICE/officers/dashboard/count",
                    Long.class
            );

            if (officerCount != null) {
                totalOfficers = officerCount;
            }

        } catch (Exception e) {

            totalOfficers = 0;

        }

        // =========================================================
        // APPLICATIONS
        // =========================================================

       // =========================================================
// LIVE APPLICATIONS
// =========================================================

try {

    List applications = restTemplate.getForObject(
            "http://api-gateway:8080/applications",
            List.class
    );

    if (applications != null) {
        totalApplications = applications.size();
    }

} catch (Exception e) {

    totalApplications = 0;

}

        // =========================================================
        // DEPARTMENTS
        // =========================================================

        try {

            List departments = restTemplate.getForObject(
                    "http://USER-SERVICE/departments",
                    List.class
            );

            if (departments != null) {
                totalDepartments = departments.size();
            }

        } catch (Exception e) {

            totalDepartments = 0;

        }

        // =========================================================
        // BUDGET
        // =========================================================

        try {

            BudgetDashboardResponse result =
                    restTemplate.getForObject(
                            "http://BUDGET-SERVICE/budgets/dashboard",
                            BudgetDashboardResponse.class
                    );

            if (result != null) {
                budget = result;
            }

        } catch (Exception e) {

            budget = new BudgetDashboardResponse();

            budget.setTotalBudget(0.0);
            budget.setAllocatedAmount(0.0);
            budget.setSpentAmount(0.0);
            budget.setRemainingAmount(0.0);

        }

        // =========================================================
        // LIVE CITIZENS
        // =========================================================

      // =========================================================
// LIVE CITIZENS
// =========================================================

try {

    List citizens = restTemplate.getForObject(
            "http://CITIZEN-SERVICE/citizens",
            List.class
    );

    if (citizens != null) {
        totalCitizens = citizens.size();
    }

} catch (Exception e) {

    totalCitizens = 0;

}
        // =========================================================
        // LIVE GRIEVANCES
        // =========================================================

        try {

            List<Map<String, Object>> grievances =
                    restTemplate.getForObject(
                            "http://GRIEVANCE-SERVICE/grievances",
                            List.class
                    );

            if (grievances != null) {

                // Total grievances
                totalGrievances = grievances.size();

                // Open grievances
                openGrievances = grievances.stream()
                        .filter(g ->
                                "OPEN".equalsIgnoreCase(
                                        String.valueOf(
                                                g.get("status")
                                        )
                                )
                        )
                        .count();

                // High priority grievances
                highPriorityGrievances = grievances.stream()
                        .filter(g ->
                                "HIGH".equalsIgnoreCase(
                                        String.valueOf(
                                                g.get("priority")
                                        )
                                )
                        )
                        .count();

                // Escalated grievances
                escalatedGrievances = grievances.stream()
                        .filter(g ->
                                Boolean.TRUE.equals(
                                        g.get("escalated")
                                )
                        )
                        .count();
            }

        } catch (Exception e) {

            totalGrievances = 0;
            openGrievances = 0;
            highPriorityGrievances = 0;
            escalatedGrievances = 0;

        }

        // =========================================================
        // FINAL DASHBOARD RESPONSE
        // =========================================================

        return new DashboardResponse(
                totalCitizens,
                totalGrievances,
                openGrievances,
                highPriorityGrievances,
                totalCertificates,
                totalOfficers,
                totalDepartments,
                totalApplications,
                budget.getTotalBudget(),
                budget.getAllocatedAmount(),
                budget.getSpentAmount(),
                budget.getRemainingAmount(),
                escalatedGrievances
        );
    }

    // =========================================================
    // CITIZEN DASHBOARD
    // =========================================================

    public CitizenDashboardResponse getCitizenDashboard(
            Long citizenId) {

        // Temporary values
        return new CitizenDashboardResponse(
                0,
                0,
                0,
                0,
                0,
                0
        );
    }

    // =========================================================
    // CITIZEN COUNT
    // =========================================================

    public long getCitizenCount() {
        return citizenRepository.count();
    }
}