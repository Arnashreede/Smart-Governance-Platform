package com.civicpulse.ai_analysis_service.service;

import com.civicpulse.ai_analysis_service.dto.GrievanceAnalysisRequest;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Arrays;
import java.util.List;

@Service
public class GrievanceClientService {

    private final DiscoveryClient discoveryClient;

    public GrievanceClientService(DiscoveryClient discoveryClient) {
        this.discoveryClient = discoveryClient;
    }

    public List<GrievanceAnalysisRequest> getAllGrievances() {

        List<ServiceInstance> instances =
                discoveryClient.getInstances("GRIEVANCE-SERVICE");

        if (instances == null || instances.isEmpty()) {
            throw new RuntimeException(
                    "GRIEVANCE-SERVICE is not available in Eureka"
            );
        }

        ServiceInstance instance = instances.get(0);

        String baseUrl = instance.getUri().toString();

        RestClient restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .build();

        GrievanceAnalysisRequest[] grievances =
                restClient.get()
                        .uri("/grievances")
                        .retrieve()
                        .body(GrievanceAnalysisRequest[].class);

        if (grievances == null) {
            return List.of();
        }

        return Arrays.asList(grievances);
    }
}