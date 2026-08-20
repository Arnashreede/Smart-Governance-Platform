package com.civicpulse.ai_analysis_service.controller;

import com.civicpulse.ai_analysis_service.dto.GrievanceAnalysisRequest;
import com.civicpulse.ai_analysis_service.report.PdfReportService;
import com.civicpulse.ai_analysis_service.service.AdminDataAggregatorService;
import com.civicpulse.ai_analysis_service.service.GeminiService;
import com.civicpulse.ai_analysis_service.service.GrievanceClientService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ai")
public class AiAnalysisController {

    private final GeminiService geminiService;
    private final GrievanceClientService grievanceClientService;
    private final PdfReportService pdfReportService;
    private final AdminDataAggregatorService adminDataAggregatorService;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public AiAnalysisController(
            GeminiService geminiService,
            GrievanceClientService grievanceClientService,
            PdfReportService pdfReportService,
            AdminDataAggregatorService adminDataAggregatorService
    ) {

        this.geminiService = geminiService;
        this.grievanceClientService = grievanceClientService;
        this.pdfReportService = pdfReportService;
        this.adminDataAggregatorService = adminDataAggregatorService;
    }


    // =========================================================
    // BASIC AI ANALYSIS
    // =========================================================

    @PostMapping("/analyze")
    public Map<String, String> analyze(
            @RequestBody Map<String, String> request
    ) {

        String prompt = request.get("prompt");

        if (prompt == null || prompt.isBlank()) {

            return Map.of(
                    "error",
                    "Prompt cannot be empty"
            );
        }

        String result =
                geminiService.analyze(prompt);

        return Map.of(
                "analysis",
                result
        );
    }


    // =========================================================
    // ANALYZE PROVIDED GRIEVANCES
    // =========================================================

    @PostMapping("/analyze/grievances")
    public Map<String, String> analyzeGrievances(
            @RequestBody List<GrievanceAnalysisRequest> grievances
    ) {

        if (grievances == null || grievances.isEmpty()) {

            return Map.of(
                    "error",
                    "No grievance data provided"
            );
        }

        String analysis =
                geminiService.analyzeGrievances(
                        grievances
                );

        return Map.of(
                "analysis",
                analysis
        );
    }


    // =========================================================
    // ANALYZE LIVE GRIEVANCES
    // =========================================================

    @PostMapping("/analyze/live-grievances")
    public Map<String, String> analyzeLiveGrievances() {

        try {

            List<GrievanceAnalysisRequest> grievances =
                    grievanceClientService.getAllGrievances();

            if (grievances == null || grievances.isEmpty()) {

                return Map.of(
                        "analysis",
                        "No grievances are currently available for analysis."
                );
            }

            String analysis =
                    geminiService.analyzeGrievances(
                            grievances
                    );

            return Map.of(
                    "analysis",
                    analysis
            );

        } catch (Exception e) {

            e.printStackTrace();

            return Map.of(
                    "analysis",
                    "Unable to analyze live grievances: "
                            + getRootMessage(e)
            );
        }
    }


    // =========================================================
    // COMPLETE ADMINISTRATIVE AI PDF REPORT
    //
    // IMPORTANT:
    // The frontend can continue calling:
    //
    // POST /ai/report/grievances
    //
    // We are NOT changing the frontend URL.
    //
    // Internally this now collects ALL administrative data.
    // =========================================================

    @PostMapping("/report/grievances")
    public ResponseEntity<?> generateGrievanceReport() {

        try {

            System.out.println(
                    "================================================"
            );

            System.out.println(
                    "AI ADMINISTRATIVE PDF REPORT GENERATION STARTED"
            );

            System.out.println(
                    "================================================"
            );


            // =====================================================
            // 1. COLLECT COMPLETE LIVE ADMINISTRATIVE DATA
            // =====================================================

            System.out.println(
                    "Collecting complete administrative data..."
            );

            Map<String, Object> administrativeData =
                    adminDataAggregatorService
                            .collectAdministrativeData();


            if (administrativeData == null
                    || administrativeData.isEmpty()) {

                throw new RuntimeException(
                        "No administrative data was returned."
                );
            }


            System.out.println(
                    "Administrative data collected successfully."
            );

            System.out.println(
                    "Available sections:"
            );

            administrativeData
                    .keySet()
                    .forEach(
                            key -> System.out.println(
                                    " - " + key
                            )
                    );


            // =====================================================
            // 2. GENERATE AI ADMINISTRATIVE ANALYSIS
            // =====================================================

            System.out.println(
                    "Generating complete administrative AI analysis..."
            );

            String analysis =
                    geminiService
                            .generateAdministrativeAnalysis(
                                    administrativeData
                            );


            if (analysis == null
                    || analysis.isBlank()) {

                throw new RuntimeException(
                        "AI administrative analysis was empty."
                );
            }


            System.out.println(
                    "Administrative AI analysis generated successfully."
            );


            // =====================================================
            // 3. GENERATE COMPLETE ADMINISTRATIVE PDF
            // =====================================================

            System.out.println(
                    "Generating complete administrative PDF..."
            );

            byte[] pdf =
                    pdfReportService
                            .generateAdministrativeReport(
                                    administrativeData,
                                    analysis
                            );


            if (pdf == null
                    || pdf.length == 0) {

                throw new RuntimeException(
                        "PDF generation returned an empty file."
                );
            }


            System.out.println(
                    "PDF generated successfully."
            );

            System.out.println(
                    "PDF size: "
                            + pdf.length
                            + " bytes"
            );


            System.out.println(
                    "================================================"
            );

            System.out.println(
                    "AI ADMINISTRATIVE PDF REPORT COMPLETED"
            );

            System.out.println(
                    "================================================"
            );


            // =====================================================
            // 4. RETURN PDF TO FRONTEND
            // =====================================================

            return ResponseEntity
                    .ok()
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=Smart-Governance-Administrative-Analytics.pdf"
                    )
                    .contentType(
                            MediaType.APPLICATION_PDF
                    )
                    .contentLength(
                            pdf.length
                    )
                    .body(pdf);


        } catch (Exception e) {

            System.err.println(
                    "================================================"
            );

            System.err.println(
                    "AI ADMINISTRATIVE PDF REPORT GENERATION FAILED"
            );

            System.err.println(
                    "================================================"
            );

            e.printStackTrace();

            String message =
                    getRootMessage(e);

            System.err.println(
                    "ROOT ERROR: " + message
            );


            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .contentType(
                            MediaType.APPLICATION_JSON
                    )
                    .body(
                            Map.of(
                                    "error",
                                    "Unable to generate AI administrative report",
                                    "message",
                                    message
                            )
                    );
        }
    }


    // =========================================================
    // GET COMPLETE ADMINISTRATIVE DATA
    // =========================================================

    @GetMapping("/admin-data")
    public Map<String, Object> getAdministrativeData() {

        return adminDataAggregatorService
                .collectAdministrativeData();
    }


    // =========================================================
    // COMPLETE ADMINISTRATION AI ANALYSIS
    // =========================================================

    @PostMapping("/analyze/administration")
    public ResponseEntity<String> analyzeAdministration() {

        try {

            System.out.println(
                    "================================================"
            );

            System.out.println(
                    "ADMINISTRATIVE AI ANALYSIS STARTED"
            );

            System.out.println(
                    "================================================"
            );


            // =====================================================
            // 1. COLLECT ALL LIVE ADMINISTRATIVE DATA
            // =====================================================

            Map<String, Object> administrativeData =
                    adminDataAggregatorService
                            .collectAdministrativeData();


            if (administrativeData == null
                    || administrativeData.isEmpty()) {

                return ResponseEntity
                        .status(
                                HttpStatus.NO_CONTENT
                        )
                        .body(
                                "No administrative data available."
                        );
            }


            // =====================================================
            // 2. GENERATE AI ANALYSIS
            // =====================================================

            String analysis =
                    geminiService
                            .generateAdministrativeAnalysis(
                                    administrativeData
                            );


            System.out.println(
                    "Administrative AI analysis completed."
            );


            // =====================================================
            // 3. RETURN ANALYSIS
            // =====================================================

            return ResponseEntity.ok(
                    analysis
            );


        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            "Unable to generate administrative analysis: "
                                    + getRootMessage(e)
                    );
        }
    }


    // =========================================================
    // ROOT ERROR MESSAGE
    // =========================================================

    private String getRootMessage(
            Throwable throwable
    ) {

        Throwable root = throwable;

        while (root.getCause() != null) {
            root = root.getCause();
        }

        if (root.getMessage() != null
                && !root.getMessage().isBlank()) {

            return root.getMessage();
        }

        return root
                .getClass()
                .getSimpleName();
    }
}