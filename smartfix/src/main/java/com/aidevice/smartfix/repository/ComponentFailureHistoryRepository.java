package com.aidevice.smartfix.repository;

import com.aidevice.smartfix.model.ComponentFailureHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComponentFailureHistoryRepository extends JpaRepository<ComponentFailureHistory, Long> {

    /**
     * Find component failure history by device and component
     */
    Optional<ComponentFailureHistory> findByDeviceTypeAndBrandAndModelAndComponentName(
            String deviceType, String brand, String model, String componentName
    );

    /**
     * Find all failures for a specific device type
     */
    List<ComponentFailureHistory> findByDeviceTypeAndBrandAndModelOrderByFailureCountDesc(
            String deviceType, String brand, String model
    );

    /**
     * Find top failing components for a device type
     */
    @Query("SELECT cfh FROM ComponentFailureHistory cfh " +
           "WHERE cfh.deviceType = :deviceType " +
           "AND (:brand IS NULL OR cfh.brand = :brand) " +
           "ORDER BY cfh.failureCount DESC")
    List<ComponentFailureHistory> findTopFailingComponents(
            @Param("deviceType") String deviceType,
            @Param("brand") String brand
    );

    /**
     * Find components with high replacement rate
     */
    @Query("SELECT cfh FROM ComponentFailureHistory cfh " +
           "WHERE cfh.deviceType = :deviceType " +
           "AND cfh.replacementCount * 100.0 / cfh.failureCount >= :minRate " +
           "ORDER BY cfh.replacementCount DESC")
    List<ComponentFailureHistory> findHighReplacementRateComponents(
            @Param("deviceType") String deviceType,
            @Param("minRate") double minRate
    );

    /**
     * Get component failure statistics
     */
    @Query("SELECT cfh.componentName, SUM(cfh.failureCount), SUM(cfh.replacementCount) " +
           "FROM ComponentFailureHistory cfh " +
           "WHERE cfh.deviceType = :deviceType " +
           "GROUP BY cfh.componentName " +
           "ORDER BY SUM(cfh.failureCount) DESC")
    List<Object[]> getComponentStatistics(@Param("deviceType") String deviceType);
}
