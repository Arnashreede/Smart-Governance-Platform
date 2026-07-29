package com.civicpulse.welfare_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

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

    private Long citizenId;

    @ManyToOne
    @JoinColumn(name = "scheme_id")
    private WelfareScheme welfareScheme;

    private String fullName;

    private Integer age;

    private String district;

    private String occupation;

    private Double annualIncome;

    @Column(length = 1000)
    private String remarks;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    @Enumerated(EnumType.STRING)
    private EligibilityStatus eligibilityStatus;

    private LocalDateTime appliedAt;
}