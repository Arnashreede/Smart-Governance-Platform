package com.civicpulse.welfare_service.service.impl;

import com.civicpulse.welfare_service.client.BudgetClient;
import com.civicpulse.welfare_service.dto.WelfareApplicationRequest;
import com.civicpulse.welfare_service.dto.WelfareApplicationResponse;
import com.civicpulse.welfare_service.entity.*;
import com.civicpulse.welfare_service.event.WelfareApplicationApprovedEvent;
import com.civicpulse.welfare_service.event.WelfareApplicationRejectedEvent;
import com.civicpulse.welfare_service.event.WelfareApplicationSubmittedEvent;
import com.civicpulse.welfare_service.repository.BeneficiaryRepository;
import com.civicpulse.welfare_service.repository.WelfareApplicationRepository;
import com.civicpulse.welfare_service.repository.WelfareSchemeRepository;
import com.civicpulse.welfare_service.service.WelfareApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import com.civicpulse.welfare_service.dto.ApplicationDocumentResponse;
import com.civicpulse.welfare_service.dto.FundDistributionRequest;
import java.time.LocalDateTime;
import java.util.List;
import com.civicpulse.welfare_service.kafka.WelfareEventProducer;

@Service
@RequiredArgsConstructor
public class WelfareApplicationServiceImpl
        implements WelfareApplicationService {
private final BudgetClient budgetClient;
    private final WelfareApplicationRepository applicationRepository;
    private final WelfareSchemeRepository schemeRepository;
private final BeneficiaryRepository beneficiaryRepository;
private final WelfareEventProducer welfareEventProducer;
    @Override
public WelfareApplicationResponse applyForScheme(
        WelfareApplicationRequest request,
        List<MultipartFile> documents) {

    WelfareScheme scheme = schemeRepository
            .findById(request.getSchemeId())
            .orElseThrow(() ->
                    new RuntimeException("Welfare Scheme not found"));

    System.out.println("Citizen ID = " + request.getCitizenId());
    System.out.println("Scheme ID = " + request.getSchemeId());

    boolean alreadyApplied =
            applicationRepository.existsByCitizenIdAndWelfareSchemeId(
                    request.getCitizenId(),
                    request.getSchemeId()
            );

    System.out.println("Already Applied = " + alreadyApplied);

    if (alreadyApplied) {
        throw new RuntimeException(
                "You have already applied for this scheme."
        );
    }

    // =========================================================
    // ELIGIBILITY
    // =========================================================

    EligibilityStatus eligibility;

    boolean incomeEligible =
            scheme.getMaxIncome() == null
                    || request.getAnnualIncome() == null
                    || request.getAnnualIncome()
                    <= scheme.getMaxIncome().doubleValue();

    boolean minAgeEligible =
            scheme.getMinimumAge() == null
                    || request.getAge() >= scheme.getMinimumAge();

    boolean maxAgeEligible =
            scheme.getMaximumAge() == null
                    || request.getAge() <= scheme.getMaximumAge();

    if (incomeEligible &&
            minAgeEligible &&
            maxAgeEligible) {

        eligibility = EligibilityStatus.ELIGIBLE;

    } else {

        eligibility = EligibilityStatus.NOT_ELIGIBLE;
    }

    // =========================================================
    // CREATE APPLICATION
    // =========================================================

    WelfareApplication application =
            WelfareApplication.builder()
                    .citizenId(request.getCitizenId())
                    .welfareScheme(scheme)
                    .department(scheme.getDepartment())
                    .fullName(request.getFullName())
                    .age(request.getAge())
                    .district(request.getDistrict())
                    .occupation(request.getOccupation())
                    .annualIncome(request.getAnnualIncome())

                    // STUDENT
                    .collegeName(request.getCollegeName())
                    .course(request.getCourse())
                    .year(request.getYear())
                    .rollNumber(request.getRollNumber())

                    // HOUSING
                    .houseType(request.getHouseType())
                    .familyMembers(request.getFamilyMembers())
                    .landOwnership(request.getLandOwnership())

                    // FARMER
                    .landArea(request.getLandArea())
                    .cropType(request.getCropType())

                    // BANK
                    .bankAccount(request.getBankAccount())
                    .ifscCode(request.getIfscCode())
                    .accountHolderName(request.getAccountHolderName())
                    .bankName(request.getBankName())

                    // PENSION
                    .maritalStatus(request.getMaritalStatus())
                    .pensionCategory(request.getPensionCategory())
                    .disabilityPercentage(
                            request.getDisabilityPercentage()
                    )

                    .remarks(request.getRemarks())
                    .status(ApplicationStatus.SUBMITTED)
                    .eligibilityStatus(eligibility)
                    .appliedAt(LocalDateTime.now())
                    .build();

    System.out.println(
            "Documents before first save = "
                    + application.getDocuments()
    );

    // =========================================================
    // SAVE APPLICATION FIRST
    // =========================================================

    applicationRepository.save(application);

    // =========================================================
    // DEBUG DOCUMENTS
    // =========================================================

    System.out.println(
            "========== WELFARE DOCUMENT DEBUG =========="
    );

    System.out.println(
            "Documents object = " + documents
    );

    if (documents == null) {

        System.out.println(
                "DOCUMENTS = NULL"
        );

    } else {

        System.out.println(
                "DOCUMENT COUNT = " + documents.size()
        );

        for (MultipartFile file : documents) {

            System.out.println(
                    "FILE = "
                            + file.getOriginalFilename()
                            + " | SIZE = "
                            + file.getSize()
                            + " | TYPE = "
                            + file.getContentType()
            );
        }
    }

    System.out.println(
            "============================================="
    );

    // =========================================================
    // SAVE DOCUMENTS
    // =========================================================

    if (documents != null &&
            !documents.isEmpty()) {

        File uploadDir =
                new File("uploads");

        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        for (MultipartFile file : documents) {

            if (file == null ||
                    file.isEmpty()) {

                System.out.println(
                        "Skipping empty file."
                );

                continue;
            }

            try {

                String fileName =
                        file.getOriginalFilename();

                if (fileName == null ||
                        fileName.isBlank()) {

                    System.out.println(
                            "Skipping file with no filename."
                    );

                    continue;
                }

                File destination =
        new File(
                uploadDir,
                fileName
        );

System.out.println(
        "Saving file to: "
                + destination.getAbsolutePath()
);

Files.copy(
        file.getInputStream(),
        destination.toPath(),
        StandardCopyOption.REPLACE_EXISTING
);

ApplicationDocument document =
        ApplicationDocument.builder()
                .application(application)
                .documentName(fileName)
                                .fileType(file.getContentType())
                                .filePath(
                                        destination
                                                .getAbsolutePath()
                                )
                                .build();

                application.getDocuments()
                        .add(document);

            } catch (IOException e) {

                throw new RuntimeException(
                        "Failed to upload file",
                        e
                );
            }
        }

        // Save application again so the
        // ApplicationDocument relationship
        // is persisted.
        applicationRepository.save(application);
    }

    // =========================================================
    // KAFKA EVENT
    // =========================================================

    welfareEventProducer.publishApplicationSubmitted(
            new WelfareApplicationSubmittedEvent(
                    application.getId(),
                    application.getCitizenId(),
                    application.getWelfareScheme()
                            .getSchemeName()
            )
    );

    System.out.println(
            "Application saved successfully. ID = "
                    + application.getId()
    );

    System.out.println(
            "Documents after upload = "
                    + application.getDocuments()
    );

    return map(application);
}

    @Override
    public List<WelfareApplicationResponse> getAllApplications() {

        return applicationRepository.findAll()
                .stream()
                .map(this::map)
                .toList();

    }
    @Override
public List<WelfareApplicationResponse> getApplicationsByDepartment(
        String department) {

    return applicationRepository
            .findByDepartment(department)
            .stream()
            .map(this::map)
            .toList();
}
@Override
public WelfareApplicationResponse getApplicationById(Long applicationId) {

    WelfareApplication application = applicationRepository
            .findById(applicationId)
            .orElseThrow(() ->
                    new RuntimeException("Application not found"));

    return map(application);
}
   @Override
public List<WelfareApplicationResponse> getCitizenApplications(Long citizenId) {

    System.out.println("Citizen ID received = " + citizenId);

    List<WelfareApplication> applications =
            applicationRepository.findByCitizenId(citizenId);

    System.out.println("Applications found = " + applications.size());

    return applications.stream()
            .map(this::map)
            .toList();
}

   @Override
public WelfareApplicationResponse approveApplication(Long applicationId) {

    WelfareApplication application =
            applicationRepository.findById(applicationId)
                    .orElseThrow(() ->
                            new RuntimeException("Application not found"));

    application.setStatus(ApplicationStatus.APPROVED);

    applicationRepository.save(application);

    if (!beneficiaryRepository.existsByWelfareApplicationId(applicationId)) {

        Beneficiary beneficiary = Beneficiary.builder()
                .citizenId(application.getCitizenId())
                .welfareScheme(application.getWelfareScheme())
                .welfareApplication(application)
                .fullName(application.getFullName())
                .district(application.getDistrict())
                .occupation(application.getOccupation())
                .annualIncome(application.getAnnualIncome())
                // ================= STUDENT =================

.collegeName(application.getCollegeName())
.course(application.getCourse())
.year(application.getYear())
.rollNumber(application.getRollNumber())

// ================= HOUSING =================

.houseType(application.getHouseType())
.familyMembers(application.getFamilyMembers())
.landOwnership(application.getLandOwnership())

// ================= FARMER =================

.landArea(application.getLandArea())
.cropType(application.getCropType())
.bankAccount(application.getBankAccount())
.ifscCode(application.getIfscCode())

// ================= PENSION =================

.maritalStatus(application.getMaritalStatus())
.pensionCategory(application.getPensionCategory())
.disabilityPercentage(application.getDisabilityPercentage())
                .benefitAmount(application.getWelfareScheme().getBenefitAmount())
                .remarks(application.getRemarks())
                .approvedAt(LocalDateTime.now())
                .benefitIssued(false)
                .build();

        beneficiaryRepository.save(beneficiary);

        // -------- Call Budget Service --------
        FundDistributionRequest request = new FundDistributionRequest();

        request.setSchemeId(application.getWelfareScheme().getId());
        request.setSchemeName(application.getWelfareScheme().getSchemeName());
        request.setCitizenId(application.getCitizenId());
        request.setBeneficiaryName(application.getFullName());
        request.setAmount(application.getWelfareScheme().getBenefitAmount());

        budgetClient.distributeFunds(
                application.getWelfareScheme().getBudgetId(),
                request
        );
    }

    return map(application);
}

   @Override
public WelfareApplicationResponse rejectApplication(
        Long applicationId,
        String rejectionReason) {

    WelfareApplication application =
            applicationRepository.findById(applicationId)
                    .orElseThrow(() ->
                            new RuntimeException("Application not found"));

    application.setStatus(ApplicationStatus.REJECTED);
    application.setRejectionReason(rejectionReason);

    applicationRepository.save(application);

    return map(application);
}
@Override
public List<WelfareApplicationResponse> getRejectedApplications() {

    return applicationRepository
            .findByStatus(ApplicationStatus.REJECTED)
            .stream()
            .map(this::map)
            .toList();
}

    private WelfareApplicationResponse map(WelfareApplication application) {

    return WelfareApplicationResponse.builder()
        .id(application.getId())
        .citizenId(application.getCitizenId())
        .schemeId(application.getWelfareScheme().getId())
        .schemeName(application.getWelfareScheme().getSchemeName())
        .fullName(application.getFullName())
        .age(application.getAge())
        .district(application.getDistrict())
        .occupation(application.getOccupation())
        .annualIncome(application.getAnnualIncome())
        .remarks(application.getRemarks())
        .status(application.getStatus().name())
        .eligibilityStatus(application.getEligibilityStatus().name())
        .appliedAt(application.getAppliedAt().toString())

        .benefitAmount(
                application.getWelfareScheme().getBenefitAmount()
        )

        .benefitIssued(
                beneficiaryRepository
                        .findByWelfareApplicationId(application.getId())
                        .map(Beneficiary::getBenefitIssued)
                        .orElse(false)
        )

        // ================= STUDENT =================
        .collegeName(application.getCollegeName())
        .course(application.getCourse())
        .year(application.getYear())
        .rollNumber(application.getRollNumber())

        // ================= HOUSING =================
        .houseType(application.getHouseType())
        .familyMembers(application.getFamilyMembers())
        .landOwnership(application.getLandOwnership())

        // ================= FARMER =================
        .landArea(application.getLandArea())
        .cropType(application.getCropType())
        .bankAccount(application.getBankAccount())
        .ifscCode(application.getIfscCode())

        // ================= PENSION =================
        .maritalStatus(application.getMaritalStatus())
        .pensionCategory(application.getPensionCategory())
        .disabilityPercentage(application.getDisabilityPercentage())

        // ================= BANK =================
        .accountHolderName(application.getAccountHolderName())
        .bankName(application.getBankName())

        .benefitIssuedAt(
                beneficiaryRepository
                        .findByWelfareApplicationId(application.getId())
                        .flatMap(b -> java.util.Optional.ofNullable(
                                b.getBenefitIssuedAt()
                        ))
                        .map(LocalDateTime::toString)
                        .orElse(null)
        )

        .documents(
                application.getDocuments()
                        .stream()
                        .map(doc -> ApplicationDocumentResponse.builder()
                                .id(doc.getId())
                                .documentName(doc.getDocumentName())
                                .fileName(doc.getDocumentName())
                                .fileType(doc.getFileType())
                                .filePath(
                                    "http://localhost:8090/uploads/"
                                    + doc.getDocumentName()
                                )
                                .build())
                        .toList()
        )
        .build();
}
}