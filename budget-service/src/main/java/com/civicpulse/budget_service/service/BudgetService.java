package com.civicpulse.budget_service.service;

import com.civicpulse.budget_service.dto.BudgetRequest;
import com.civicpulse.budget_service.dto.BudgetResponse;

import java.util.List;
import com.civicpulse.budget_service.dto.AllocationRequest;
import com.civicpulse.budget_service.dto.ExpenseRequest;
import com.civicpulse.budget_service.dto.FundDistributionRequest;
import com.civicpulse.budget_service.dto.FundDistributionResponse;
import com.civicpulse.budget_service.dto.DashboardResponse;
public interface BudgetService {

    BudgetResponse createBudget(BudgetRequest request);

    List<BudgetResponse> getAllBudgets();

    BudgetResponse getBudgetById(Long id);
BudgetResponse updateBudget(Long id, BudgetRequest request);
void deleteBudget(Long id);

BudgetResponse allocateBudget(Long id, AllocationRequest request);
BudgetResponse addExpense(Long id, ExpenseRequest request);
FundDistributionResponse distributeFunds(Long budgetId,
                                         FundDistributionRequest request);
List<FundDistributionResponse> getFundDistributions(Long budgetId);
DashboardResponse getDashboardSummary();
} 
