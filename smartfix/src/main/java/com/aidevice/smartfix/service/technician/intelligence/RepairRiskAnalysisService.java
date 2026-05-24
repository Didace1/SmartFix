package com.aidevice.smartfix.service.technician.intelligence;

import com.aidevice.smartfix.dto.technician.TechnicianAssistDtos.*;
import com.aidevice.smartfix.model.RepairPatternStatistics;
import com.aidevice.smartfix.repository.RepairPatternStatisticsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Service for analyzing repair risks and generating warnings.
 * Identifies high-risk repair patterns based on return rates.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RepairRiskAnalysisService {

    private final RepairPatternStatisticsRepository patternRepository;

    /**
     * Analyze repair risks and generate warnings
     */
    @Transactional(readOnly = true)
    public List<RiskWarning> analyzeRepairRisks(AssistanceRequest request) {
        log.info("Analyzing repair risks for: {} {}", request.getDeviceType(), request.getBrand());

        List<RiskWarning> warnings = new ArrayList<>();

        // Check for high-risk patterns
        List<RepairPatternStatistics> highRiskPatterns = patternRepository
                .findHighRiskPatterns(request.getDeviceType(), 20.0); // 20% return rate threshold

        for (RepairPatternStatistics pattern : highRiskPatterns) {
            // Check if symptoms match this risky pattern
            if (symptomsMatchPattern(request.getSymptoms(), pattern.getSymptomPattern())) {
                RiskWarning warning = createRiskWarning(pattern);
                warnings.add(warning);
            }
        }

        // Check for incomplete repair patterns
        warnings.addAll(checkIncompleteRepairPatterns(request));

        // Check for recurring failure patterns
        warnings.addAll(checkRecurringFailures(request));

        log.info("Generated {} risk warnings", warnings.size());
        return warnings;
    }

    /**
     * Create risk warning from pattern statistics
     */
    private RiskWarning createRiskWarning(RepairPatternStatistics pattern) {
        String severity = determineSeverity(pattern.getReturnRate());
        String message = generateWarningMessage(pattern);
        String recommendation = generateRiskRecommendation(pattern);
        String reasoning = generateRiskReasoning(pattern);

        return RiskWarning.builder()
                .warningType("HIGH_RETURN_RATE")
                .severity(severity)
                .message(message)
                .recommendation(recommendation)
                .returnRate(pattern.getReturnRate().doubleValue())
                .affectedCases(pattern.getOccurrenceCount())
                .reasoning(reasoning)
                .build();
    }

    /**
     * Determine severity level
     */
    private String determineSeverity(BigDecimal returnRate) {
        double rate = returnRate.doubleValue();
        if (rate >= 40.0) {
            return "CRITICAL";
        } else if (rate >= 30.0) {
            return "HIGH";
        } else if (rate >= 20.0) {
            return "MEDIUM";
        } else {
            return "LOW";
        }
    }

    /**
     * Generate warning message
     */
    private String generateWarningMessage(RepairPatternStatistics pattern) {
        return String.format(
                "⚠️ WARNING: Similar repairs have a %.1f%% return rate. " +
                "This repair pattern has shown higher-than-average failure rates.",
                pattern.getReturnRate().doubleValue()
        );
    }

    /**
     * Generate risk recommendation
     */
    private String generateRiskRecommendation(RepairPatternStatistics pattern) {
        StringBuilder recommendation = new StringBuilder();

        recommendation.append("RECOMMENDED ACTIONS:\n");
        recommendation.append("1. Perform thorough diagnostic testing before repair\n");
        recommendation.append("2. Check for related component failures\n");
        recommendation.append("3. Consider root cause analysis\n");

        if (pattern.getCommonSolution() != null && !pattern.getCommonSolution().isBlank()) {
            recommendation.append("4. Review successful approach: ");
            recommendation.append(pattern.getCommonSolution());
        }

        return recommendation.toString();
    }

    /**
     * Generate risk reasoning
     */
    private String generateRiskReasoning(RepairPatternStatistics pattern) {
        return String.format(
                "Based on %d historical cases with similar symptoms, %.1f%% resulted in returns. " +
                "This suggests potential underlying issues that may not be addressed by standard repairs.",
                pattern.getOccurrenceCount(),
                pattern.getReturnRate().doubleValue()
        );
    }

    /**
     * Check if symptoms match pattern
     */
    private boolean symptomsMatchPattern(String symptoms, String pattern) {
        if (symptoms == null || pattern == null) {
            return false;
        }

        String normalizedSymptoms = symptoms.toLowerCase();
        String normalizedPattern = pattern.toLowerCase();

        // Simple keyword matching
        String[] patternWords = normalizedPattern.split("\\s+");
        int matchCount = 0;

        for (String word : patternWords) {
            if (word.length() > 3 && normalizedSymptoms.contains(word)) {
                matchCount++;
            }
        }

        // Consider it a match if at least 30% of pattern words are found
        return matchCount >= (patternWords.length * 0.3);
    }

    /**
     * Check for incomplete repair patterns
     */
    private List<RiskWarning> checkIncompleteRepairPatterns(AssistanceRequest request) {
        List<RiskWarning> warnings = new ArrayList<>();

        // Common incomplete repair scenarios
        String symptoms = request.getSymptoms().toLowerCase();

        if (symptoms.contains("charging") && !symptoms.contains("battery")) {
            warnings.add(RiskWarning.builder()
                    .warningType("INCOMPLETE_DIAGNOSIS")
                    .severity("MEDIUM")
                    .message("⚠️ Charging issues often involve both port and battery. " +
                            "Repairing only the charging port may result in return.")
                    .recommendation("Inspect both charging port AND battery condition. " +
                            "Test battery health before completing repair.")
                    .reasoning("Historical data shows charging-port-only repairs have higher return rates " +
                            "when battery degradation is not addressed.")
                    .build());
        }

        if (symptoms.contains("display") && symptoms.contains("backlight")) {
            warnings.add(RiskWarning.builder()
                    .warningType("COMPONENT_DEPENDENCY")
                    .severity("MEDIUM")
                    .message("⚠️ Display backlight issues may indicate motherboard problems.")
                    .recommendation("Check display connector and backlight IC on motherboard. " +
                            "Screen replacement alone may not resolve the issue.")
                    .reasoning("Backlight failures often stem from motherboard-level issues, " +
                            "not just the display panel.")
                    .build());
        }

        return warnings;
    }

    /**
     * Check for recurring failure patterns
     */
    private List<RiskWarning> checkRecurringFailures(AssistanceRequest request) {
        List<RiskWarning> warnings = new ArrayList<>();

        // Check for patterns with low success rates
        List<RepairPatternStatistics> lowSuccessPatterns = patternRepository
                .findByDeviceTypeAndBrandOrderByOccurrenceCountDesc(
                        request.getDeviceType(),
                        request.getBrand()
                );

        for (RepairPatternStatistics pattern : lowSuccessPatterns) {
            if (pattern.getSuccessRate() != null && 
                pattern.getSuccessRate().compareTo(new BigDecimal("60.0")) < 0 &&
                pattern.getOccurrenceCount() >= 5) {
                
                if (symptomsMatchPattern(request.getSymptoms(), pattern.getSymptomPattern())) {
                    warnings.add(RiskWarning.builder()
                            .warningType("LOW_SUCCESS_RATE")
                            .severity("HIGH")
                            .message(String.format(
                                    "⚠️ This repair type has only %.1f%% success rate in historical data.",
                                    pattern.getSuccessRate().doubleValue()
                            ))
                            .recommendation("Consider alternative repair approaches or escalate to senior technician. " +
                                    "Review all similar cases before proceeding.")
                            .affectedCases(pattern.getOccurrenceCount())
                            .reasoning(String.format(
                                    "Out of %d similar repairs, only %.1f%% were successful without returns.",
                                    pattern.getOccurrenceCount(),
                                    pattern.getSuccessRate().doubleValue()
                            ))
                            .build());
                    break; // Only add one low-success warning
                }
            }
        }

        return warnings;
    }

    /**
     * Get all high-risk patterns for a device type
     */
    @Transactional(readOnly = true)
    public List<RiskWarning> getHighRiskPatterns(String deviceType, String brand) {
        log.info("Getting high-risk patterns for: {} {}", deviceType, brand);

        List<RepairPatternStatistics> patterns = patternRepository
                .findHighRiskPatterns(deviceType, 20.0);

        return patterns.stream()
                .map(this::createRiskWarning)
                .toList();
    }
}
