package com.civicpulse.budget_service.service;

import com.civicpulse.budget_service.dto.BudgetRequest;
import com.civicpulse.budget_service.dto.BudgetResponse;
import com.civicpulse.budget_service.entity.Budget;
import com.civicpulse.budget_service.repository.BudgetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import com.civicpulse.budget_service.dto.AllocationRequest;
import com.civicpulse.budget_service.dto.ExpenseRequest;
import com.civicpulse.budget_service.dto.FundDistributionRequest;
import com.civicpulse.budget_service.dto.FundDistributionResponse;
import com.civicpulse.budget_service.entity.FundDistribution;
import com.civicpulse.budget_service.repository.FundDistributionRepository;
import com.civicpulse.budget_service.dto.DashboardResponse;
@Service
@RequiredArgsConstructor
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository budgetRepository;
private final FundDistributionRepository fundDistributionRepository;
    @Override
    public BudgetResponse createBudget(BudgetRequest request) {

        Budget budget = Budget.builder()
                .department(request.getDepartment())
                .financialYear(request.getFinancialYear())
                .totalBudget(request.getTotalBudget())
                .allocatedAmount(BigDecimal.ZERO)
                .spentAmount(BigDecimal.ZERO)
                .remainingAmount(request.getTotalBudget())
                .build();

        Budget saved = budgetRepository.save(budget);

        return BudgetResponse.builder()
                .id(saved.getId())
                .department(saved.getDepartment())
                .financialYear(saved.getFinancialYear())
                .totalBudget(saved.getTotalBudget())
                .allocatedAmount(saved.getAllocatedAmount())
                .spentAmount(saved.getSpentAmount())
                .remainingAmount(saved.getRemainingAmount())
                .build();
    }

    @Override
    public List<BudgetResponse> getAllBudgets() {
        return budgetRepository.findAll()
                .stream()
                .map(budget -> BudgetResponse.builder()
                        .id(budget.getId())
                        .department(budget.getDepartment())
                        .financialYear(budget.getFinancialYear())
                        .totalBudget(budget.getTotalBudget())
                        .allocatedAmount(budget.getAllocatedAmount())
                        .spentAmount(budget.getSpentAmount())
                        .remainingAmount(budget.getRemainingAmount())
                        .build())
                .toList();
    }

    @Override
    public BudgetResponse getBudgetById(Long id) {

        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        return BudgetResponse.builder()
                .id(budget.getId())
                .department(budget.getDepartment())
                .financialYear(budget.getFinancialYear())
                .totalBudget(budget.getTotalBudget())
                .allocatedAmount(budget.getAllocatedAmount())
                .spentAmount(budget.getSpentAmount())
                .remainingAmount(budget.getRemainingAmount())
                .build();

    }
    @Override
public BudgetResponse updateBudget(Long id, BudgetRequest request) {

    Budget budget = budgetRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Budget not found"));

    budget.setDepartment(request.getDepartment());
    budget.setFinancialYear(request.getFinancialYear());
    budget.setTotalBudget(request.getTotalBudget());

    budget.setRemainingAmount(
            request.getTotalBudget().subtract(budget.getSpentAmount())
    );

    Budget updated = budgetRepository.save(budget);

    return BudgetResponse.builder()
            .id(updated.getId())
            .department(updated.getDepartment())
            .financialYear(updated.getFinancialYear())
            .totalBudget(updated.getTotalBudget())
            .allocatedAmount(updated.getAllocatedAmount())
            .spentAmount(updated.getSpentAmount())
            .remainingAmount(updated.getRemainingAmount())
            .build();
}
@Override
public void deleteBudget(Long id) {

    Budget budget = budgetRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Budget not found"));

    budgetRepository.delete(budget);
}

@Override
public BudgetResponse allocateBudget(Long id, AllocationRequest request) {

    Budget budget = budgetRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Budget not found"));

    BigDecimal newAllocated = budget.getAllocatedAmount().add(request.getAmount());

    if (newAllocated.compareTo(budget.getTotalBudget()) > 0) {
        throw new RuntimeException("Allocation exceeds total budget");
    }

    budget.setAllocatedAmount(newAllocated);
    budget.setRemainingAmount(
    budget.getTotalBudget().subtract(
        budget.getSpentAmount()
    )
);
    Budget updated = budgetRepository.save(budget);

    return BudgetResponse.builder()
            .id(updated.getId())
            .department(updated.getDepartment())
            .financialYear(updated.getFinancialYear())
            .totalBudget(updated.getTotalBudget())
            .allocatedAmount(updated.getAllocatedAmount())
            .spentAmount(updated.getSpentAmount())
            .remainingAmount(updated.getRemainingAmount())
            .build();
}
@Override
public BudgetResponse addExpense(Long id, ExpenseRequest request) {

    Budget budget = budgetRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Budget not found"));

    BigDecimal newSpent = budget.getSpentAmount().add(request.getAmount());

    if (newSpent.compareTo(budget.getAllocatedAmount()) > 0) {
        throw new RuntimeException("Expense exceeds allocated budget");
    }

    budget.setSpentAmount(newSpent);

    budget.setRemainingAmount(
    budget.getTotalBudget().subtract(newSpent)
);

    Budget updated = budgetRepository.save(budget);

    return BudgetResponse.builder()
            .id(updated.getId())
            .department(updated.getDepartment())
            .financialYear(updated.getFinancialYear())
            .totalBudget(updated.getTotalBudget())
            .allocatedAmount(updated.getAllocatedAmount())
            .spentAmount(updated.getSpentAmount())
            .remainingAmount(updated.getRemainingAmount())
            .build();
}
@Override
public FundDistributionResponse distributeFunds(Long budgetId,
                                                FundDistributionRequest request) {

    Budget budget = budgetRepository.findById(budgetId)
            .orElseThrow(() -> new RuntimeException("Budget not found"));

    if (request.getAmount().compareTo(budget.getRemainingAmount()) > 0) {
        throw new RuntimeException("Insufficient remaining budget");
    }

    FundDistribution distribution = FundDistribution.builder()
        .schemeId(request.getSchemeId())
        .schemeName(request.getSchemeName())
        .citizenId(request.getCitizenId())
        .beneficiaryName(request.getBeneficiaryName())
        .amount(request.getAmount())
        .paymentMode(request.getPaymentMode())
        .remarks(request.getRemarks())
        .budget(budget)
        .build();

    FundDistribution saved = fundDistributionRepository.save(distribution);

    // Update budget
    budget.setSpentAmount(
            budget.getSpentAmount().add(request.getAmount())
    );

    budget.setRemainingAmount(
            budget.getRemainingAmount().subtract(request.getAmount())
    );

    budgetRepository.save(budget);

    return FundDistributionResponse.builder()
        .id(saved.getId())
        .schemeId(saved.getSchemeId())
        .schemeName(saved.getSchemeName())
        .citizenId(saved.getCitizenId())
        .beneficiaryName(saved.getBeneficiaryName())
        .amount(saved.getAmount())
        .paymentMode(saved.getPaymentMode())
        .remarks(saved.getRemarks())
        .budgetId(budget.getId())
        .build();
}
@Override
public List<FundDistributionResponse> getFundDistributions(Long budgetId) {

    return fundDistributionRepository.findByBudgetId(budgetId)
            .stream()
            .map(distribution -> FundDistributionResponse.builder()
                    .id(distribution.getId())
                    .schemeId(distribution.getSchemeId())
                    .schemeName(distribution.getSchemeName())
                    .citizenId(distribution.getCitizenId())
                    .beneficiaryName(distribution.getBeneficiaryName())
                    .amount(distribution.getAmount())
                    .paymentMode(distribution.getPaymentMode())
                    .remarks(distribution.getRemarks())
                    .budgetId(distribution.getBudget().getId())
                    .build())
            .toList();
}
@Override
public DashboardResponse getDashboardSummary() {

    List<Budget> budgets = budgetRepository.findAll();

    double total = budgets.stream()
            .map(Budget::getTotalBudget)
            .filter(java.util.Objects::nonNull)
            .mapToDouble(java.math.BigDecimal::doubleValue)
            .sum();

    double allocated = budgets.stream()
            .map(Budget::getAllocatedAmount)
            .filter(java.util.Objects::nonNull)
            .mapToDouble(java.math.BigDecimal::doubleValue)
            .sum();

    double spent = budgets.stream()
            .map(Budget::getSpentAmount)
            .filter(java.util.Objects::nonNull)
            .mapToDouble(java.math.BigDecimal::doubleValue)
            .sum();

    double remaining = total - allocated;

    return DashboardResponse.builder()
            .totalBudget(total)
            .allocatedAmount(allocated)
            .spentAmount(spent)
            .remainingAmount(remaining)
            .build();
}
}