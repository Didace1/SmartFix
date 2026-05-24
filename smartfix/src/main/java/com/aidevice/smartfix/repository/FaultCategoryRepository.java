package com.aidevice.smartfix.repository;

import com.aidevice.smartfix.model.FaultCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FaultCategoryRepository extends JpaRepository<FaultCategory, Long> {
    
    Optional<FaultCategory> findByCategoryCode(String categoryCode);
    
    Optional<FaultCategory> findByCategoryName(String categoryName);
}
