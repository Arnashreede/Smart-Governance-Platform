package com.civicpulse.welfare_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "welfare_schemes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WelfareScheme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String schemeName;

    private String department;

    @Column(length = 1000)
    private String description;

    private String category;

    @Column(length = 2000)
    private String eligibilityCriteria;

    private BigDecimal benefitAmount;

    private BigDecimal allocatedBudget;
private Long budgetId;
    @Builder.Default
    private BigDecimal utilizedBudget = BigDecimal.ZERO;

    private Integer maxBeneficiaries;

    private BigDecimal maxIncome;

    private Integer minimumAge;

    private Integer maximumAge;

    private LocalDate startDate;

    private LocalDate endDate;

    @Builder.Default
    private Boolean active = true;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}