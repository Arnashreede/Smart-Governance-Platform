package com.civicpulse.budget_service.repository;

import com.civicpulse.budget_service.entity.FundDistribution;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FundDistributionRepository extends JpaRepository<FundDistribution, Long> {

    List<FundDistribution> findByBudgetId(Long budgetId);
}