package com.civicpulse.budget_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "fund_distributions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FundDistribution {

    @Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

private Long schemeId;

private String schemeName;

private Long citizenId;

private String beneficiaryName;

private BigDecimal amount;

    @ManyToOne
    @JoinColumn(name = "budget_id")
    private Budget budget;
}