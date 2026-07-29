package com.civicpulse.welfare_service.repository;

import com.civicpulse.welfare_service.entity.Beneficiary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BeneficiaryRepository extends JpaRepository<Beneficiary, Long> {

    List<Beneficiary> findByCitizenId(Long citizenId);

    boolean existsByWelfareApplicationId(Long welfareApplicationId);
long countByWelfareSchemeId(Long schemeId);
}