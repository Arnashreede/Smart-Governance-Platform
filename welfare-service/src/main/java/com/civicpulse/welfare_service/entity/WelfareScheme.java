package com.civicpulse.welfare_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


import com.civicpulse.welfare_service.enums.SchemeStatus;

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
@Column(nullable = false, unique = true)
private String schemeCode;
    @Column(nullable = false)
    private String schemeName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SchemeType schemeType;

    private String department;

    @Column(length = 1000)
    private String description;

    private String category;

    @Column(length = 2000)
    private String eligibilityCriteria;

    @ElementCollection
    @CollectionTable(
        name = "welfare_scheme_required_documents",
        joinColumns = @JoinColumn(name = "scheme_id")
    )
    @Column(name = "document_name")
    private List<String> requiredDocuments;

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

    @Enumerated(EnumType.STRING)
@Builder.Default
private SchemeStatus status = SchemeStatus.ACTIVE;
@Builder.Default
private LocalDateTime updatedAt = LocalDateTime.now();
    @Builder.Default
    private Boolean active = true;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}