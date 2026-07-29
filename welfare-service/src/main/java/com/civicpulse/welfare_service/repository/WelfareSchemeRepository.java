package com.civicpulse.welfare_service.repository;

import com.civicpulse.welfare_service.entity.WelfareScheme;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WelfareSchemeRepository extends JpaRepository<WelfareScheme,Long>{

    boolean existsBySchemeName(String schemeName);
long countByActiveTrue();
}