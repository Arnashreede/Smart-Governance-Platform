package com.civicpulse.welfare_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "welfare_applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WelfareApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String applicationNumber;

    private Long citizenId;

    private Long officerId;

    @ManyToOne
    @JoinColumn(name = "scheme_id")
    private WelfareScheme welfareScheme;

    private String department;

    @Column(nullable = false)
    private String fullName;

    private Integer age;

    private String district;

    private String occupation;

    private Double annualIncome;
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
private String bankName;

private String accountHolderName;
// ================= PENSION =================

private String maritalStatus;

private String pensionCategory;

private Integer disabilityPercentage;
    @Column(length = 1000)
    private String remarks;

    @Column(length = 1000)
    private String rejectionReason;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private ApplicationStatus status = ApplicationStatus.SUBMITTED;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private EligibilityStatus eligibilityStatus = EligibilityStatus.PENDING;

    @Builder.Default
    private LocalDateTime appliedAt = LocalDateTime.now();

    private LocalDateTime reviewedAt;

    private LocalDateTime approvedAt;

    @Builder.Default
    @OneToMany(
            mappedBy = "application",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<ApplicationDocument> documents = new ArrayList<>();
}