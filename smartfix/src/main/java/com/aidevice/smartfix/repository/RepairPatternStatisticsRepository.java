package com.aidevice.smartfix.repository;

import com.aidevice.smartfix.model.RepairPatternStatistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RepairPatternStatisticsRepository extends JpaRepository<RepairPatternStatistics, Long> {

    /**
     * Find pattern by device and symptom
     */
    Optional<RepairPatternStatistics> findByDeviceTypeAndBrandAndSymptomPattern(
            String deviceType, String brand, String symptomPattern
    );

    /**
     * Find patterns for a specific device type
     */
    List<RepairPatternStatistics> findByDeviceTypeAndBrandOrderByOccurrenceCountDesc(
            String deviceType, String brand
    );

    /**
     * Find patterns with high success rate
     */
    @Query("SELECT rps FROM RepairPatternStatistics rps " +
           "WHERE rps.deviceType = :deviceType " +
           "AND rps.successRate >= :minSuccessRate " +
           "ORDER BY rps.successRate DESC, rps.occurrenceCount DESC")
    List<RepairPatternStatistics> findHighSuccessPatterns(
            @Param("deviceType") String deviceType,
            @Param("minSuccessRate") double minSuccessRate
    );

    /**
     * Find patterns with high return rate (risky repairs)
     */
    @Query("SELECT rps FROM RepairPatternStatistics rps " +
           "WHERE rps.deviceType = :deviceType " +
           "AND rps.returnRate >= :minReturnRate " +
           "ORDER BY rps.returnRate DESC")
    List<RepairPatternStatistics> findHighRiskPatterns(
            @Param("deviceType") String deviceType,
            @Param("minReturnRate") double minReturnRate
    );

    /**
     * Search patterns by symptom similarity (full-text search)
     */
    @Query(value = "SELECT * FROM repair_pattern_statistics " +
                   "WHERE device_type = :deviceType " +
                   "AND to_tsvector('english', symptom_pattern) @@ plainto_tsquery('english', :symptoms) " +
                   "ORDER BY occurrence_count DESC " +
                   "LIMIT :limit",
           nativeQuery = true)
    List<RepairPatternStatistics> searchBySymptomsFullText(
            @Param("deviceType") String deviceType,
            @Param("symptoms") String symptoms,
            @Param("limit") int limit
    );

    /**
     * Find most common patterns
     */
    @Query("SELECT rps FROM RepairPatternStatistics rps " +
           "WHERE rps.deviceType = :deviceType " +
           "ORDER BY rps.occurrenceCount DESC")
    List<RepairPatternStatistics> findMostCommonPatterns(
            @Param("deviceType") String deviceType
    );

    /**
     * Get fault category distribution
     */
    @Query("SELECT rps.faultCategory, COUNT(rps), SUM(rps.occurrenceCount) " +
           "FROM RepairPatternStatistics rps " +
           "WHERE rps.deviceType = :deviceType " +
           "GROUP BY rps.faultCategory " +
           "ORDER BY SUM(rps.occurrenceCount) DESC")
    List<Object[]> getFaultCategoryDistribution(@Param("deviceType") String deviceType);
}
