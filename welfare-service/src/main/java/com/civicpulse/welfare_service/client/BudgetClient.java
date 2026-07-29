package com.civicpulse.welfare_service.client;

import com.civicpulse.welfare_service.dto.FundDistributionRequest;
import com.civicpulse.welfare_service.dto.FundDistributionResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "budget-service")
public interface BudgetClient {

    @PostMapping("/budgets/{id}/distribute")
    FundDistributionResponse distributeFunds(
            @PathVariable("id") Long id,
            @RequestBody FundDistributionRequest request
    );
}