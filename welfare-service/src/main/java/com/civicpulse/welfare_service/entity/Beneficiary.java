package com.civicpulse.welfare_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "beneficiaries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Beneficiary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Citizen who receives the benefit
    @Column(nullable = false)
    private Long citizenId;

    // Welfare Scheme
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheme_id", nullable = false)
    private WelfareScheme welfareScheme;

    // Approved Application
    @OneToOne
    @JoinColumn(name = "application_id", nullable = false, unique = true)
    private WelfareApplication welfareApplication;

    private String fullName;

    private String district;

    private String occupation;

    private Double annualIncome;

    @Column(nullable = false)
    private BigDecimal benefitAmount;

    @Column(length = 1000)
    private String remarks;

    private LocalDateTime approvedAt;

    @Builder.Default
    private Boolean benefitIssued = false;

    private LocalDateTime benefitIssuedAt;

    // ================= STUDENT =================

    private String collegeName;
    private String course;
    private Integer year;
    private String rollNumber;

    // ================= HOUSING =================

    private String houseType;
    private Integer familyMembers;
    private Boolean landOwnership;

    // ================= FARMER =================

    private Double landArea;
    private String cropType;
    private String bankAccount;
    private String ifscCode;

    // ================= PENSION =================

    private String maritalStatus;
    private String pensionCategory;
    private Integer disabilityPercentage;

    // ================= PAYMENT =================

    private String paymentStatus;

    private String transactionId;

    private LocalDate paymentDate;
}