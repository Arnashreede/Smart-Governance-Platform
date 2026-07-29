package com.civicpulse.budget_service.controller;

import com.civicpulse.budget_service.dto.BudgetRequest;
import com.civicpulse.budget_service.dto.BudgetResponse;
import com.civicpulse.budget_service.service.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.civicpulse.budget_service.dto.ExpenseRequest;
import java.util.List;
import com.civicpulse.budget_service.dto.AllocationRequest;
import com.civicpulse.budget_service.dto.FundDistributionRequest;
import com.civicpulse.budget_service.dto.FundDistributionResponse;
import com.civicpulse.budget_service.dto.DashboardResponse;
@RestController
@RequestMapping("/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @PostMapping
    public BudgetResponse createBudget(@RequestBody BudgetRequest request) {
        return budgetService.createBudget(request);
    }

    @GetMapping
    public List<BudgetResponse> getAllBudgets() {
        return budgetService.getAllBudgets();
    }

    @GetMapping("/{id}")
    public BudgetResponse getBudgetById(@PathVariable Long id) {
        return budgetService.getBudgetById(id);
    }
    @PutMapping("/{id}")
public BudgetResponse updateBudget(@PathVariable Long id,
                                   @RequestBody BudgetRequest request) {
    return budgetService.updateBudget(id, request);
}

@DeleteMapping("/{id}")
public void deleteBudget(@PathVariable Long id) {
    budgetService.deleteBudget(id);
}
@PutMapping("/{id}/allocate")
public BudgetResponse allocateBudget(
        @PathVariable Long id,
        @RequestBody AllocationRequest request) {

    return budgetService.allocateBudget(id, request);
}
@PutMapping("/{id}/expense")
public BudgetResponse addExpense(
        @PathVariable Long id,
        @RequestBody ExpenseRequest request) {

    return budgetService.addExpense(id, request);
}
@PostMapping("/{id}/distribute")
public FundDistributionResponse distributeFunds(
        @PathVariable Long id,
        @RequestBody FundDistributionRequest request) {

    return budgetService.distributeFunds(id, request);
}
@GetMapping("/{id}/distributions")
public List<FundDistributionResponse> getFundDistributions(
        @PathVariable Long id) {

    return budgetService.getFundDistributions(id);
}
@GetMapping("/dashboard")
public DashboardResponse getDashboardSummary() {
    return budgetService.getDashboardSummary();
}
}