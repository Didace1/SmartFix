package com.aidevice.smartfix.service.technician.intelligence;

import com.aidevice.smartfix.dto.technician.TechnicianAssistDtos.*;
import com.aidevice.smartfix.model.RepairPatternStatistics;
import com.aidevice.smartfix.repository.RepairPatternStatisticsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for detecting repair patterns and trends.
 * Identifies recurring symptom-fault-solution patterns.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RepairPatternDetectionService {

    private final RepairPatternStatisticsRepository patternRepository;

    /**
     * Detect repair patterns for given device and symptoms
     */
    @Transactional(readOnly = true)
    public List<RepairPattern> detectPatterns(PatternDetectionRequest request) {
        log.info("Detecting patterns for: {} {}", request.getDeviceType(), request.getBrand());

        // Find patterns for this device type
        List<RepairPatternStatistics> patterns = patternRepository
                .findByDeviceTypeAndBrandOrderByOccurrenceCountDesc(
                        request.getDeviceType(),
                        request.getBrand()
                );

        // Filter by minimum occurrences and success rate
        List<RepairPattern> detectedPatterns = patterns.stream()
                .filter(p -> p.getOccurrenceCount() >= request.getMinOccurrences())
                .filter(p -> p.getSuccessRate() == null || 
                            p.getSuccessRate().doubleValue() >= request.getMinSuccessRate())
                .map(this::mapToRepairPattern)
                .collect(Collectors.toList());

        log.info("Detected {} patterns", detectedPatterns.size());
        return detectedPatterns;
    }

    /**
     * Search patterns by symptom similarity
     */
    @Transactional(readOnly = true)
    public List<RepairPattern> searchPatternsBySymptoms(String deviceType, String symptoms, int limit) {
        log.info("Searching patterns by symptoms for: {}", deviceType);

        List<RepairPatternStatistics> patterns = patternRepository
                .searchBySymptomsFullText(deviceType, symptoms, limit);

        return patterns.stream()
                .map(this::mapToRepairPattern)
                .collect(Collectors.toList());
    }

    /**
     * Get most common patterns
     */
    @Transactional(readOnly = true)
    public List<RepairPattern> getMostCommonPatterns(String deviceType, int limit) {
        log.info("Getting most common patterns for: {}", deviceType);

        List<RepairPatternStatistics> patterns = patternRepository
                .findMostCommonPatterns(deviceType);

        return patterns.stream()
                .limit(limit)
                .map(this::mapToRepairPattern)
                .collect(Collectors.toList());
    }

    /**
     * Get high-success patterns
     */
    @Transactional(readOnly = true)
    public List<RepairPattern> getHighSuccessPatterns(String deviceType, double minSuccessRate) {
        log.info("Getting high-success patterns for: {} with min rate: {}", deviceType, minSuccessRate);

        List<RepairPatternStatistics> patterns = patternRepository
                .findHighSuccessPatterns(deviceType, minSuccessRate);

        return patterns.stream()
                .map(this::mapToRepairPattern)
                .collect(Collectors.toList());
    }

    /**
     * Map pattern statistics to DTO
     */
    private RepairPattern mapToRepairPattern(RepairPatternStatistics stats) {
        String recommendation = generatePatternRecommendation(stats);

        return RepairPattern.builder()
                .patternDescription(stats.getSymptomPattern())
                .faultCategory(stats.getFaultCategory())
                .commonSolution(stats.getCommonSolution())
                .occurrenceCount(stats.getOccurrenceCount())
                .successRate(stats.getSuccessRate())
                .returnRate(stats.getReturnRate())
                .confidenceLevel(stats.getConfidenceLevel())
                .recommendation(recommendation)
                .build();
    }

    /**
     * Generate recommendation based on pattern
     */
    private String generatePatternRecommendation(RepairPatternStatistics stats) {
        StringBuilder recommendation = new StringBuilder();

        // Success rate assessment
        if (stats.getSuccessRate() != null) {
            double successRate = stats.getSuccessRate().doubleValue();
            if (successRate >= 80.0) {
                recommendation.append("✓ HIGHLY RECOMMENDED: ");
            } else if (successRate >= 70.0) {
                recommendation.append("✓ RECOMMENDED: ");
            } else if (successRate >= 60.0) {
                recommendation.append("⚠ PROCEED WITH CAUTION: ");
            } else {
                recommendation.append("⚠ HIGH RISK: ");
            }
        }

        // Pattern description
        recommendation.append(String.format(
                "This pattern has been observed %d times. ",
                stats.getOccurrenceCount()
        ));

        // Success/return rate info
        if (stats.getSuccessRate() != null) {
            recommendation.append(String.format(
                    "Success rate: %.1f%%. ",
                    stats.getSuccessRate().doubleValue()
            ));
        }

        if (stats.getReturnRate() != null && stats.getReturnRate().doubleValue() > 0) {
            recommendation.append(String.format(
                    "Return rate: %.1f%%. ",
                    stats.getReturnRate().doubleValue()
            ));
        }

        // Solution recommendation
        if (stats.getCommonSolution() != null && !stats.getCommonSolution().isBlank()) {
            recommendation.append("Common solution: ");
            recommendation.append(stats.getCommonSolution());
        }

        return recommendation.toString();
    }

    /**
     * Analyze pattern trends over time
     */
    @Transactional(readOnly = true)
    public List<RepairPattern> analyzePatternTrends(String deviceType, String brand) {
        log.info("Analyzing pattern trends for: {} {}", deviceType, brand);

        List<RepairPatternStatistics> patterns = patternRepository
                .findByDeviceTypeAndBrandOrderByOccurrenceCountDesc(deviceType, brand);

        // Identify emerging patterns (recent occurrences with growing frequency)
        return patterns.stream()
                .filter(p -> p.getOccurrenceCount() >= 3) // Minimum threshold
                .map(this::mapToRepairPattern)
                .collect(Collectors.toList());
    }

    /**
     * Get fault category distribution
     */
    @Transactional(readOnly = true)
    public List<Object[]> getFaultCategoryDistribution(String deviceType) {
        return patternRepository.getFaultCategoryDistribution(deviceType);
    }
}
