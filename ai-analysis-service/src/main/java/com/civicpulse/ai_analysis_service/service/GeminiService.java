package com.civicpulse.ai_analysis_service.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    private final ObjectMapper objectMapper = new ObjectMapper();

    /*
     * Gemini can temporarily return 503 when the model is under
     * high demand. We retry a few times before failing.
     */
    private static final int MAX_RETRIES = 3;

    private static final long RETRY_DELAY_MS = 3000;


    // ============================================================
    // BASIC GEMINI ANALYSIS
    // ============================================================

    public String analyze(String prompt) {

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.APPLICATION_JSON);

        headers.set(
                "x-goog-api-key",
                apiKey
        );

        Map<String, Object> requestBody =
                Map.of(
                        "contents",
                        new Object[]{
                                Map.of(
                                        "parts",
                                        new Object[]{
                                                Map.of(
                                                        "text",
                                                        prompt
                                                )
                                        }
                                )
                        }
                );

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(
                        requestBody,
                        headers
                );

        return callGeminiWithRetry(request);
    }


    // ============================================================
    // GEMINI REQUEST WITH RETRY
    // ============================================================

    @SuppressWarnings("unchecked")
    private String callGeminiWithRetry(
            HttpEntity<Map<String, Object>> request
    ) {

        Exception lastException = null;

        for (int attempt = 1;
             attempt <= MAX_RETRIES;
             attempt++) {

            try {

                System.out.println(
                        "Gemini API request attempt "
                                + attempt
                                + "/"
                                + MAX_RETRIES
                );

                Map<String, Object> response =
                        restTemplate.postForObject(
                                apiUrl,
                                request,
                                Map.class
                        );

                System.out.println(
                        "Gemini API request successful."
                );

                return extractResponse(response);

            } catch (HttpStatusCodeException e) {

                lastException = e;

                int statusCode =
                        e.getStatusCode().value();

                System.err.println(
                        "Gemini API returned HTTP "
                                + statusCode
                );

                /*
                 * Retry only temporary/rate-limit errors.
                 *
                 * 503 = model temporarily unavailable
                 * 429 = rate limit / temporary overload
                 */
                if (statusCode == 503
                        || statusCode == 429) {

                    if (attempt < MAX_RETRIES) {

                        System.err.println(
                                "Gemini temporarily unavailable. "
                                        + "Retrying in "
                                        + RETRY_DELAY_MS
                                        + " ms..."
                        );

                        sleepBeforeRetry();

                        continue;
                    }
                }

                /*
                 * Do not retry authentication, bad request,
                 * permission, etc.
                 */
                throw new RuntimeException(
                        "Gemini API request failed. HTTP "
                                + statusCode
                                + ": "
                                + e.getResponseBodyAsString(),
                        e
                );

            } catch (Exception e) {

                lastException = e;

                System.err.println(
                        "Gemini API request failed: "
                                + e.getMessage()
                );

                /*
                 * Network/temporary errors can also be retried.
                 */
                if (attempt < MAX_RETRIES) {

                    System.err.println(
                            "Retrying Gemini request in "
                                    + RETRY_DELAY_MS
                                    + " ms..."
                    );

                    sleepBeforeRetry();

                } else {

                    break;
                }
            }
        }

        throw new RuntimeException(
                "Gemini API is temporarily unavailable after "
                        + MAX_RETRIES
                        + " attempts. Please try again shortly.",
                lastException
        );
    }


    private void sleepBeforeRetry() {

        try {

            Thread.sleep(
                    RETRY_DELAY_MS
            );

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                    "Gemini retry interrupted.",
                    e
            );
        }
    }


    // ============================================================
    // GRIEVANCE ANALYSIS
    // ============================================================

    public String analyzeGrievances(
            List<com.civicpulse.ai_analysis_service.dto.GrievanceAnalysisRequest> grievances
    ) {

        StringBuilder data =
                new StringBuilder();

        for (var grievance : grievances) {

            data.append(
                    """
                    
                    Grievance:
                    ID: %s
                    Department: %s
                    Category: %s
                    Priority: %s
                    Status: %s
                    Assigned Officer: %s
                    Created At: %s
                    Due Date: %s
                    SLA Hours: %s
                    Escalated: %s
                    Title: %s
                    Description: %s
                    Remarks: %s
                    
                    """.formatted(
                            grievance.getId(),
                            grievance.getDepartment(),
                            grievance.getCategory(),
                            grievance.getPriority(),
                            grievance.getStatus(),
                            grievance.getAssignedOfficer(),
                            grievance.getCreatedAt(),
                            grievance.getDueDate(),
                            grievance.getSlaHours(),
                            grievance.isEscalated(),
                            grievance.getTitle(),
                            grievance.getDescription(),
                            grievance.getRemarks()
                    )
            );
        }

        String prompt =
                """
                You are an AI administrative analysis assistant for a
                Smart Governance Platform.

                Analyze the following grievance data.

                Your analysis must contain these sections:

                1. EXECUTIVE SUMMARY
                Give a concise overview of the current grievance situation.

                2. KEY FINDINGS
                Identify the most important observations from the data.

                3. TRENDS AND PATTERNS
                Identify recurring categories, departments, priorities,
                statuses, or other meaningful patterns.

                4. AREAS REQUIRING ATTENTION
                Identify problems that administrators should investigate.

                Classify each issue as:

                CRITICAL
                HIGH
                MODERATE
                LOW

                5. RECOMMENDED IMPROVEMENTS
                Give practical actions administrators can take to improve
                grievance handling and service delivery.

                6. PRIORITY ACTIONS
                List the most important actions that should be taken first.

                IMPORTANT DATA ACCURACY RULES:

                - Base your analysis ONLY on the supplied data.
                - Do not invent statistics.
                - Do not invent grievance IDs.
                - Do not invent officer names.
                - Do not invent department names.
                - Do not invent dates.
                - Do not invent escalation information.
                - Do not invent SLA information.
                - Do not invent relationships between records.
                - If information is missing, explicitly say that it is unavailable.
                - Do not treat null or empty fields as evidence of failure.
                - Do not claim causation unless the data directly supports it.
                - Distinguish observations from recommendations.
                - Be concise and professional.

                GRIEVANCE DATA:
                """
                        + data;

        return analyze(prompt);
    }


    // ============================================================
    // COMPLETE ADMINISTRATIVE ANALYSIS
    // ============================================================

    public String generateAdministrativeAnalysis(
            Map<String, Object> administrativeData
    ) {

        String dataJson;

        try {

            dataJson =
                    objectMapper.writeValueAsString(
                            administrativeData
                    );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Unable to prepare administrative data",
                    e
            );
        }


        String prompt =
                """
                You are an AI administrative intelligence assistant
                for a Smart Governance Platform.

                You are analyzing LIVE data collected directly from
                the administrative microservices of the platform.

                Your job is to help an administrator understand the
                current state of the platform.

                ====================================================
                DATA SOURCES
                ====================================================

                The supplied data may contain:

                - Citizens
                - Departments
                - Officers
                - Grievances
                - Applications
                - Welfare schemes
                - Certificates
                - Budgets
                - Reports
                - Audit records
                - Notifications

                ====================================================
                STRICT DATA ACCURACY RULES
                ====================================================

                1. USE ONLY THE SUPPLIED DATA.

                Do not use outside knowledge to create facts about
                this platform.

                2. NEVER INVENT STATISTICS.

                Never invent:
                - totals
                - percentages
                - counts
                - dates
                - budgets
                - application numbers
                - grievance numbers
                - certificate numbers
                - officer workload
                - department workload

                3. NEVER INVENT RECORDS.

                Never create:
                - citizen IDs
                - officer IDs
                - grievance IDs
                - application IDs
                - certificate IDs
                - department names
                - officer names
                - scheme names

                4. NEVER ASSUME AN EVENT OCCURRED.

                Do NOT say a grievance was escalated unless the
                supplied data explicitly indicates:
                escalated = true

                or an authoritative summary explicitly reports
                an escalation.

                5. APPLICATION STATUS MUST BE EVIDENCE-BASED.

                Only describe an application as APPROVED when its
                supplied status is actually APPROVED.

                Only describe an application as REJECTED when its
                supplied status is actually REJECTED.

                Only describe an application as PENDING when the
                supplied data explicitly indicates a pending state.

                6. USE AUTHORITATIVE SUMMARY DATA.

                If the "reports" section contains aggregate
                statistics, treat those values as the authoritative
                totals.

                7. DO NOT TREAT PARTIAL RECORDS AS COMPLETE DATA.

                The detailed records supplied to the AI may be
                incomplete.

                Therefore do not claim "all records" unless the data
                explicitly establishes that the supplied records
                are complete.

                8. NULL OR EMPTY FIELDS ARE NOT AUTOMATICALLY PROBLEMS.

                assignedOfficer = null does NOT automatically mean
                that a grievance is being neglected.

                createdAt = null does NOT automatically mean that
                SLA processing failed.

                Only report such issues when the available data
                provides sufficient evidence.

                9. SERVICE AVAILABILITY MUST BE EVIDENCE-BASED.

                Do not say a service is offline simply because
                a field is missing.

                10. CROSS-SERVICE RELATIONSHIPS MUST BE SUPPORTED.

                Do not claim that one service caused a problem
                in another service unless the supplied data
                supports that conclusion.

                Correlation must not automatically be presented
                as causation.

                11. DISTINGUISH:

                OBSERVED FACT
                A fact directly present in the data.

                PATTERN
                A meaningful pattern supported by multiple
                supplied records.

                RECOMMENDATION
                An administrative action suggested because of
                an observed fact or supported pattern.

                12. SPECIFIC RECORD REFERENCES MUST EXIST.

                Never mention a specific citizen, officer, grievance,
                application, certificate, department or welfare scheme
                unless that exact record exists in the supplied data.

                13. VERIFY NUMBERS BEFORE FINALIZING.

                Before producing the final report, verify every
                numerical statement against the supplied data.

                14. HANDLE CONFLICTING DATA CAREFULLY.

                If detailed records and summary statistics appear
                inconsistent, explicitly mention the discrepancy.

                15. DATA LIMITATIONS MUST BE HONEST.

                If something cannot be determined from the supplied
                data, write:

                "Not available in the supplied data."

                ====================================================
                REPORT FORMAT
                ====================================================

                # EXECUTIVE SUMMARY

                Provide a concise overview of the current
                administrative situation.

                # SYSTEM OVERVIEW

                Summarize the available administrative data.

                # CITIZEN AND SERVICE ACTIVITY

                Analyze citizen activity and service usage where
                sufficient data exists.

                # GRIEVANCE INTELLIGENCE

                Analyze:
                - grievance volume
                - statuses
                - priorities
                - categories
                - departments
                - assigned officers
                - escalations
                - unresolved grievances
                - SLA information

                # APPLICATION AND SERVICE PERFORMANCE

                Analyze:
                - approved applications
                - rejected applications
                - pending applications
                - application types
                - processing observations

                # WELFARE PROGRAMME ANALYSIS

                Analyze welfare schemes, applications, beneficiaries,
                allocated budgets and utilized budgets when available.

                # CERTIFICATE SERVICES

                Analyze:
                - certificates issued
                - certificate types
                - departments involved
                - officers involved
                - processing information

                # OFFICER AND DEPARTMENT PERFORMANCE

                Analyze:
                - workload patterns
                - assignment patterns
                - unresolved work
                - department-level patterns

                Do not label an officer or department as
                underperforming unless the supplied data clearly
                supports that conclusion.

                # BUDGET AND RESOURCE OBSERVATIONS

                Analyze:
                - total budget
                - allocation
                - expenditure
                - remaining amount
                - utilization

                Use authoritative report values when available.

                Do not automatically interpret zero expenditure as
                financial failure. It may indicate incomplete or
                delayed reporting.

                # CROSS-SERVICE INSIGHTS

                Identify meaningful relationships between services
                only when the supplied data supports them.

                # AREAS REQUIRING ATTENTION

                Classify supported issues as:

                CRITICAL
                HIGH
                MODERATE
                LOW

                For every issue explain:
                - What was observed
                - Why it matters
                - Which administrative area is affected

                # RECOMMENDED ACTIONS

                Provide practical actions administrators can take.

                # PRIORITY ACTION PLAN

                Give the most important actions in order.

                Use:

                1. Action
                   Reason:
                   Expected impact:

                2. Action
                   Reason:
                   Expected impact:

                3. Action
                   Reason:
                   Expected impact:

                # DATA LIMITATIONS

                Clearly identify:
                - unavailable services
                - incomplete data
                - missing fields
                - conflicting data
                - areas where conclusions cannot be made

                ====================================================
                FINAL QUALITY CHECK
                ====================================================

                Before returning the report, verify:

                ✓ Every number exists in the supplied data.
                ✓ Every named person exists in the supplied data.
                ✓ Every named ID exists in the supplied data.
                ✓ Every escalation claim is supported.
                ✓ Every approval claim is supported.
                ✓ Every budget figure is supported.
                ✓ Every service availability claim is supported.
                ✓ No fake statistics were created.
                ✓ No fake records were created.
                ✓ Recommendations are clearly separated from facts.
                ✓ Missing information is reported honestly.

                ====================================================
                LIVE ADMINISTRATIVE DATA
                ====================================================

                %s
                """.formatted(dataJson);

        return analyze(prompt);
    }


    // ============================================================
    // GEMINI RESPONSE EXTRACTION
    // ============================================================

    @SuppressWarnings("unchecked")
    private String extractResponse(
            Map<String, Object> response
    ) {

        if (response == null) {

            return "No response received from Gemini.";
        }

        try {

            List<Map<String, Object>> candidates =
                    (List<Map<String, Object>>)
                            response.get("candidates");

            if (candidates == null
                    || candidates.isEmpty()) {

                return "Gemini returned no analysis.";
            }

            Map<String, Object> content =
                    (Map<String, Object>)
                            candidates
                                    .get(0)
                                    .get("content");

            if (content == null) {

                return "Gemini returned no content.";
            }

            List<Map<String, Object>> parts =
                    (List<Map<String, Object>>)
                            content.get("parts");

            if (parts == null
                    || parts.isEmpty()) {

                return "Gemini returned no analysis text.";
            }

            Object text =
                    parts
                            .get(0)
                            .get("text");

            if (text == null) {

                return "Gemini returned an empty analysis.";
            }

            return String.valueOf(text);

        } catch (Exception e) {

            e.printStackTrace();

            return "Unable to process Gemini response.";
        }
    }
}