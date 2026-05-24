package com.aidevice.smartfix.service.technician.intelligence;

import com.aidevice.smartfix.dto.technician.TechnicianAssistDtos.*;
import com.aidevice.smartfix.model.ComponentFailureHistory;
import com.aidevice.smartfix.repository.ComponentFailureHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for predicting component failures based on historical data.
 * Analyzes component failure patterns and replacement rates.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ComponentPredictionService {

    private final ComponentFailureHistoryRepository componentFailureRepository;

    /**
     * Predict likely failing components for a device
     */
    @Transactional(readOnly = true)
    public List<ComponentPrediction> predictFailingComponents(ComponentPredictionRequest request) {
        log.info("Predicting component failures for device: {} {}", request.getDeviceType(), request.getBrand());

        // Get component failure history for this device
        List<ComponentFailureHistory> failureHistory = componentFailureRepository
                .findByDeviceTypeAndBrandAndModelOrderByFailureCountDesc(
                        request.getDeviceType(),
                        request.getBrand(),
                        request.getModel()
                );

        if (failureHistory.isEmpty()) {
            // Try without model filter
            failureHistory = componentFailureRepository.findTopFailingComponents(
                    request.getDeviceType(),
                    request.getBrand()
            );
        }

        log.debug("Found {} components in failure history", failureHistory.size());

        // Generate predictions
        List<ComponentPrediction> predictions = failureHistory.stream()
                .map(this::createComponentPrediction)
                .filter(pred -> pred.getFailureProbability() >= request.getMinFailureRate())
                .sorted(Comparator.comparingDouble(ComponentPrediction::getFailureProbability).reversed())
                .limit(request.getTopN())
                .collect(Collectors.toList());

        log.info("Generated {} component predictions", predictions.size());
        return predictions;
    }

    /**
     * Create component prediction from failure history
     */
    private ComponentPrediction createComponentPrediction(ComponentFailureHistory history) {
        // Calculate failure probability based on historical data
        double failureProbability = calculateFailureProbability(history);

        // Calculate replacement rate
        double replacementRate = history.getFailureRate();

        // Determine confidence level
        String confidenceLevel = determineConfidenceLevel(history.getFailureCount());

        // Generate recommendation
        String recommendation = generateRecommendation(history, failureProbability, replacementRate);

        return ComponentPrediction.builder()
                .componentName(history.getComponentName())
                .failureProbability(Math.round(failureProbability * 100.0) / 100.0)
                .historicalFailures(history.getFailureCount())
                .historicalReplacements(history.getReplacementCount())
                .replacementRate(Math.round(replacementRate * 100.0) / 100.0)
                .recommendation(recommendation)
                .confidenceLevel(confidenceLevel)
                .build();
    }

    /**
     * Calculate failure probability considering recency and frequency
     */
    private double calculateFailureProbability(ComponentFailureHistory history) {
        // Base probability from failure frequency
        double baseProbability = Math.min(history.getFailureCount() * 2.0, 100.0);

        // Recency factor: more recent failures increase probability
        double recencyFactor = calculateRecencyFactor(history.getLastFailureDate());

        // Replacement rate factor: high replacement rate increases probability
        double replacementFactor = history.getFailureRate() / 100.0;

        // Combined probability
        double probability = baseProbability * recencyFactor * (0.7 + (replacementFactor * 0.3));

        // Cap at 95% (never claim 100% certainty)
        return Math.min(probability, 95.0);
    }

    /**
     * Calculate recency factor (more recent = higher factor)
     */
    private double calculateRecencyFactor(LocalDateTime lastFailureDate) {
        if (lastFailureDate == null) {
            return 0.5; // Default for unknown dates
        }

        long daysSinceFailure = ChronoUnit.DAYS.between(lastFailureDate, LocalDateTime.now());

        // Recent failures are more relevant
        if (daysSinceFailure <= 30) return 1.2;
        if (daysSinceFailure <= 90) return 1.0;
        if (daysSinceFailure <= 180) return 0.8;
        if (daysSinceFailure <= 365) return 0.6;
        return 0.4;
    }

    /**
     * Determine confidence level based on sample size
     */
    private String determineConfidenceLevel(int failureCount) {
        if (failureCount >= 50) {
            return "HIGH";
        } else if (failureCount >= 20) {
            return "MEDIUM";
        } else if (failureCount >= 5) {
            return "LOW";
        } else {
            return "VERY_LOW";
        }
    }

    /**
     * Generate actionable recommendation
     */
    private String generateRecommendation(ComponentFailureHistory history, 
                                          double failureProbability, 
                                          double replacementRate) {
        StringBuilder recommendation = new StringBuilder();

        if (failureProbability >= 70.0) {
            recommendation.append("HIGH PRIORITY: ");
            recommendation.append(String.format("Inspect %s immediately. ", history.getComponentName()));
        } else if (failureProbability >= 50.0) {
            recommendation.append("MEDIUM PRIORITY: ");
            recommendation.append(String.format("Check %s during diagnosis. ", history.getComponentName()));
        } else {
            recommendation.append("LOW PRIORITY: ");
            recommendation.append(String.format("Consider %s as secondary possibility. ", history.getComponentName()));
        }

        if (replacementRate >= 80.0) {
            recommendation.append("Component typically requires replacement. ");
        } else if (replacementRate >= 50.0) {
            recommendation.append("Component may need replacement. ");
        } else {
            recommendation.append("Component may be repairable. ");
        }

        // Add historical context
        recommendation.append(String.format("Based on %d historical cases.", history.getFailureCount()));

        return recommendation.toString();
    }

    /**
     * Get component statistics for a device type
     */
    @Transactional(readOnly = true)
    public List<ComponentPrediction> getComponentStatistics(String deviceType, String brand) {
        log.info("Getting component statistics for: {} {}", deviceType, brand);

        List<ComponentFailureHistory> history = componentFailureRepository
                .findTopFailingComponents(deviceType, brand);

        return history.stream()
                .map(this::createComponentPrediction)
                .sorted(Comparator.comparingDouble(ComponentPrediction::getFailureProbability).reversed())
                .collect(Collectors.toList());
    }

    /**
     * Get high-risk components (high replacement rate)
     */
    @Transactional(readOnly = true)
    public List<ComponentPrediction> getHighRiskComponents(String deviceType, double minReplacementRate) {
        log.info("Finding high-risk components for: {} with min rate: {}", deviceType, minReplacementRate);

        List<ComponentFailureHistory> history = componentFailureRepository
                .findHighReplacementRateComponents(deviceType, minReplacementRate);

        return history.stream()
                .map(this::createComponentPrediction)
                .sorted(Comparator.comparingDouble(ComponentPrediction::getReplacementRate).reversed())
                .collect(Collectors.toList());
    }
}
