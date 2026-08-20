package com.civicpulse.ai_analysis_service.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminDataAggregatorService {

    private final RestTemplate restTemplate;

    public AdminDataAggregatorService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Collects live administrative data from all major
     * microservices through Eureka.
     *
     * No statistics or records are hardcoded here.
     *
     * Sensitive authentication and personal information
     * is removed before the data is passed to AI analysis.
     */
    public Map<String, Object> collectAdministrativeData() {

        Map<String, Object> data = new LinkedHashMap<>();

        // =========================================================
        // CITIZENS
        // =========================================================

        data.put(
                "citizens",
                sanitizeUsers(
                        getData(
                                "USER-SERVICE",
                                "/users"
                        )
                )
        );

        // =========================================================
        // DEPARTMENTS
        // =========================================================

        data.put(
                "departments",
                getData(
                        "USER-SERVICE",
                        "/departments"
                )
        );

        // =========================================================
        // OFFICERS
        // =========================================================

        data.put(
                "officers",
                sanitizeOfficers(
                        getData(
                                "OFFICER-SERVICE",
                                "/officers"
                        )
                )
        );

        // =========================================================
        // GRIEVANCES
        // =========================================================

        data.put(
                "grievances",
                getData(
                        "GRIEVANCE-SERVICE",
                        "/grievances"
                )
        );

        // =========================================================
        // APPLICATIONS
        // =========================================================

        data.put(
    "applications",
    getDirectData(
        "http://service-management-service:8088/applications"
    )
);

        // =========================================================
        // WELFARE
        // =========================================================

        data.put(
                "welfare",
                getData(
                        "WELFARE-SERVICE",
                        "/welfare"
                )
        );

        // =========================================================
        // CERTIFICATES
        // =========================================================

        data.put(
                "certificates",
                sanitizeCertificates(
                        getData(
                                "CERTIFICATE-SERVICE",
                                "/certificates"
                        )
                )
        );

        // =========================================================
        // BUDGETS
        // =========================================================

        data.put(
                "budgets",
                getData(
                        "BUDGET-SERVICE",
                        "/budgets"
                )
        );

        // =========================================================
        // REPORTING
        // =========================================================

        data.put(
                "reports",
                getData(
                        "REPORTING-SERVICE",
                        "/reports/dashboard"
                )
        );

        // =========================================================
        // AUDIT
        // =========================================================

        data.put(
                "audit",
                getData(
                        "AUDIT-SERVICE",
                        "/audit"
                )
        );

        // =========================================================
        // NOTIFICATIONS
        // =========================================================

        data.put(
                "notifications",
                getData(
                        "NOTIFICATION-SERVICE",
                        "/notifications"
                )
        );

        return data;
    }


    // =============================================================
    // USER SANITIZATION
    // =============================================================

    /**
     * Removes sensitive information from USER-SERVICE data.
     *
     * The AI does not need:
     * - password
     * - email
     * - phone
     *
     * It only receives information useful for
     * administrative analysis.
     */
    private Object sanitizeUsers(Object rawData) {

        if (!(rawData instanceof Collection<?> collection)) {
            return rawData;
        }

        List<Map<String, Object>> sanitized =
                new ArrayList<>();

        for (Object item : collection) {

            if (!(item instanceof Map<?, ?> original)) {
                continue;
            }

            Map<String, Object> user =
                    new LinkedHashMap<>();

            copyIfPresent(
                    original,
                    user,
                    "id"
            );

            copyIfPresent(
                    original,
                    user,
                    "fullName"
            );

            copyIfPresent(
                    original,
                    user,
                    "role"
            );

            copyIfPresent(
                    original,
                    user,
                    "designation"
            );

            copyIfPresent(
                    original,
                    user,
                    "department"
            );

            copyIfPresent(
                    original,
                    user,
                    "active"
            );

            sanitized.add(user);
        }

        return sanitized;
    }


    // =============================================================
    // OFFICER SANITIZATION
    // =============================================================

    /**
     * Removes sensitive information from OFFICER-SERVICE data.
     *
     * The AI does not need:
     * - password
     * - phone
     * - email
     *
     * Employee ID and administrative attributes
     * are retained because they can help identify
     * workload and departmental relationships.
     */
    private Object sanitizeOfficers(Object rawData) {

        if (!(rawData instanceof Collection<?> collection)) {
            return rawData;
        }

        List<Map<String, Object>> sanitized =
                new ArrayList<>();

        for (Object item : collection) {

            if (!(item instanceof Map<?, ?> original)) {
                continue;
            }

            Map<String, Object> officer =
                    new LinkedHashMap<>();

            copyIfPresent(
                    original,
                    officer,
                    "id"
            );

            copyIfPresent(
                    original,
                    officer,
                    "employeeId"
            );

            copyIfPresent(
                    original,
                    officer,
                    "fullName"
            );

            copyIfPresent(
                    original,
                    officer,
                    "department"
            );

            copyIfPresent(
                    original,
                    officer,
                    "departmentId"
            );

            copyIfPresent(
                    original,
                    officer,
                    "designation"
            );

            copyIfPresent(
                    original,
                    officer,
                    "status"
            );

            copyIfPresent(
                    original,
                    officer,
                    "active"
            );

            sanitized.add(officer);
        }

        return sanitized;
    }


    // =============================================================
    // CERTIFICATE SANITIZATION
    // =============================================================

    /**
     * Removes sensitive certificate information.
     *
     * The AI does not need:
     * - certificate number
     * - verification code
     * - QR code URL
     * - citizen name
     *
     * It can still analyze:
     * - certificate type
     * - department
     * - officer
     * - issue date
     * - validity
     */
    private Object sanitizeCertificates(Object rawData) {

        if (!(rawData instanceof Collection<?> collection)) {
            return rawData;
        }

        List<Map<String, Object>> sanitized =
                new ArrayList<>();

        for (Object item : collection) {

            if (!(item instanceof Map<?, ?> original)) {
                continue;
            }

            Map<String, Object> certificate =
                    new LinkedHashMap<>();

            copyIfPresent(
                    original,
                    certificate,
                    "certificateId"
            );

            copyIfPresent(
                    original,
                    certificate,
                    "applicationId"
            );

            copyIfPresent(
                    original,
                    certificate,
                    "citizenId"
            );

            copyIfPresent(
                    original,
                    certificate,
                    "departmentName"
            );

            copyIfPresent(
                    original,
                    certificate,
                    "officerId"
            );

            copyIfPresent(
                    original,
                    certificate,
                    "officerName"
            );

            copyIfPresent(
                    original,
                    certificate,
                    "serviceName"
            );

            copyIfPresent(
                    original,
                    certificate,
                    "issueDate"
            );

            copyIfPresent(
                    original,
                    certificate,
                    "validTill"
            );

            sanitized.add(certificate);
        }

        return sanitized;
    }


    // =============================================================
    // COPY FIELD HELPER
    // =============================================================

    /**
     * Copies a field only when it exists.
     *
     * This prevents NullPointerException and allows
     * the aggregator to work even when different
     * services return slightly different structures.
     */
    private void copyIfPresent(
            Map<?, ?> source,
            Map<String, Object> target,
            String field) {

        if (source.containsKey(field)) {

            target.put(
                    field,
                    source.get(field)
            );
        }
    }


    // =============================================================
    // MICROservice DATA FETCH
    // =============================================================

    /**
     * Calls a microservice through Eureka.
     *
     * Example:
     *
     * http://GRIEVANCE-SERVICE/grievances
     *
     * Because the RestTemplate is @LoadBalanced,
     * Eureka resolves the service name to the
     * registered service instance.
     */
    private Object getData(
            String serviceName,
            String endpoint) {

        try {

            String url =
                    "http://"
                            + serviceName
                            + endpoint;

            return restTemplate.getForObject(
                    url,
                    Object.class
            );

        } catch (Exception exception) {

            /*
             * One unavailable service should not
             * destroy the complete administrative
             * analysis.
             *
             * The AI can identify that this particular
             * data source was unavailable.
             */

            Map<String, Object> unavailable =
                    new LinkedHashMap<>();

            unavailable.put(
                    "available",
                    false
            );

            unavailable.put(
                    "service",
                    serviceName
            );

            unavailable.put(
                    "endpoint",
                    endpoint
            );

            unavailable.put(
                    "message",
                    exception.getMessage()
            );

            return unavailable;
        }
    }
    private Object getDirectData(String url) {

    try {
        return new RestTemplate()
                .getForObject(url, Object.class);

    } catch (Exception exception) {

        Map<String, Object> unavailable =
                new LinkedHashMap<>();

        unavailable.put("available", false);
        unavailable.put("endpoint", url);
        unavailable.put("message", exception.getMessage());

        return unavailable;
    }
}
}