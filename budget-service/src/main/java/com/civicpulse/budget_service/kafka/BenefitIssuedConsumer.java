package com.civicpulse.budget_service.kafka;

import com.civicpulse.budget_service.entity.Budget;
import com.civicpulse.budget_service.repository.BudgetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class BenefitIssuedConsumer {

    private final BudgetRepository budgetRepository;

    @KafkaListener(
            topics = "benefit-issued",
            groupId = "budget-service-group"
    )
    public void handleBenefitIssued(BenefitIssuedEvent event) {

        System.out.println(
                "Received benefit-issued event: beneficiaryId="
                        + event.getBeneficiaryId()
                        + ", amount="
                        + event.getAmount()
        );

        if (event.getBudgetId() == null) {
            System.out.println(
                    "Ignoring benefit event because budgetId is null."
            );
            return;
        }

        if (event.getAmount() == null || event.getAmount() <= 0) {
            System.out.println(
                    "Ignoring benefit event because amount is invalid."
            );
            return;
        }

        Budget budget = budgetRepository.findById(
                event.getBudgetId()
        ).orElseThrow(() ->
                new RuntimeException(
                        "Budget not found: "
                                + event.getBudgetId()
                )
        );

        BigDecimal amount =
                BigDecimal.valueOf(event.getAmount());

        BigDecimal currentSpent =
                budget.getSpentAmount() == null
                        ? BigDecimal.ZERO
                        : budget.getSpentAmount();

        BigDecimal newSpent =
                currentSpent.add(amount);

        BigDecimal totalBudget =
                budget.getTotalBudget() == null
                        ? BigDecimal.ZERO
                        : budget.getTotalBudget();

        if (newSpent.compareTo(totalBudget) > 0) {
            throw new RuntimeException(
                    "Benefit exceeds total budget for budget "
                            + event.getBudgetId()
            );
        }

        budget.setSpentAmount(newSpent);

        budget.setRemainingAmount(
                totalBudget.subtract(newSpent)
        );

        budgetRepository.save(budget);

        System.out.println(
                "Budget updated successfully. Budget ID="
                        + budget.getId()
                        + ", spent="
                        + newSpent
                        + ", remaining="
                        + budget.getRemainingAmount()
        );
    }
}