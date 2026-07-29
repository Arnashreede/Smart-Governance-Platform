package com.civicpulse.budget_service.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class AllocationRequest {

    private BigDecimal amount;
}