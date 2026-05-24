package com.aidevice.smartfix.service.technician.intelligence;

import com.aidevice.smartfix.dto.technician.TechnicianAssistDtos.*;
import com.aidevice.smartfix.model.RepairCase;
import com.aidevice.smartfix.repository.RepairCaseRepository;
import com.aidevice.smartfix.repository.RepairPatternStatisticsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for generating fault hypotheses based on historical repair data.
 * Uses frequency-based statistical analysis to predict probable faults.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class FaultHypothesisService {

    private final RepairCaseRepository repairCaseRepository;
    private final RepairPatternStatisticsRepository patternRepository;
    private final CaseSimilarityService similarityService;

    /**
     * Generate probable fault predictions based on symptoms and device info
     */
    @Transactional(readOnly = true)
    public List<ProbableFault> predictProbableFaults(FaultPredictionRequest request) {
        log.info("Predicting faults for device: {}, symptoms: {}", 
                request.getDeviceType(), request.getSymptoms().substring(0, Math.min(50, request.getSymptoms().length())));

        // Find similar cases
        SimilarCaseSearchRequest searchRequest = SimilarCaseSearchRequest.builder()
                .deviceType(request.getDeviceType())
                .brand(request.getBrand())
                .symptoms(request.getSymptoms())
                .limit(50) // Get more cases for better statistics
                .minSimilarity(0.2) // Lower threshold for broader analysis
                .excludeReturned(false) // Include all cases for analysis
                .build();

        List<SimilarCase> similarCases = similarityService.findSimilarCases(searchRequest);

        if (similarCases.isEmpty()) {
            log.warn("No similar cases found for fault prediction");
            return Collections.emptyList();
        }

        // Get actual repair cases for fault analysis
        List<Long> caseIds = similarCases.stream()
                .map(SimilarCase::getCaseId)
                .collect(Collectors.toList());

        List<RepairCase> repairCases = repairCaseRepository.findAllById(caseIds);

        // Analyze fault categories
        Map<String, FaultStatistics> faultStats = analyzeFaultCategories(repairCases, similarCases);

        // Generate fault predictions
        List<ProbableFault> predictions = faultStats.entrySet().stream()
                .map(entry -> createFaultPrediction(entry.getKey(), entry.getValue(), repairCases.size()))
                .sorted(Comparator.comparingDouble(ProbableFault::getProbability).reversed())
                .limit(request.getTopN())
                .collect(Collectors.toList());

        log.info("Generated {} fault predictions", predictions.size());
        return predictions;
    }

    /**
     * Analyze fault categories from repair cases
     */
    private Map<String, FaultStatistics> analyzeFaultCategories(
            List<RepairCase> repairCases, 
            List<SimilarCase> similarCases) {
        
        Map<String, FaultStatistics> faultStats = new HashMap<>();

        // Create a map of case ID to similarity score
        Map<Long, Double> similarityScores = similarCases.stream()
                .collect(Collectors.toMap(
                        SimilarCase::getCaseId,
                        SimilarCase::getSimilarityScore
                ));

        for (RepairCase repairCase : repairCases) {
            String faultCategory = repairCase.getFinalFaultCode();
            if (faultCategory == null || faultCategory.isBlank()) {
                continue;
            }

            Double similarityScore = similarityScores.getOrDefault(repairCase.getCaseId(), 0.5);

            FaultStatistics stats = faultStats.computeIfAbsent(
                    faultCategory, 
                    k -> new FaultStatistics()
            );

            stats.incrementCount();
            stats.addSimilarityScore(similarityScore);
            
            if (!repairCase.isReturnedAfterRepair()) {
                stats.incrementSuccessCount();
            }

            // Collect diagnosis text for reasoning
            if (repairCase.getDiagnosisText() != null && !repairCase.getDiagnosisText().isBlank()) {
                stats.addDiagnosisExample(repairCase.getDiagnosisText());
            }
        }

        return faultStats;
    }

    /**
     * Create fault prediction from statistics
     */
    private ProbableFault createFaultPrediction(String faultCategory, FaultStatistics stats, int totalCases) {
        // Calculate probability based on frequency and similarity scores
        double rawProbability = (double) stats.getCount() / totalCases;
        double weightedProbability = rawProbability * stats.getAverageSimilarity();
        
        // Normalize to percentage
        double probability = weightedProbability * 100.0;

        // Determine confidence level
        String confidenceLevel = determineConfidenceLevel(stats.getCount(), stats.getAverageSimilarity());

        // Generate reasoning
        String reasoning = generateReasoning(faultCategory, stats, totalCases);

        // Get fault description
        String description = getFaultDescription(faultCategory);

        return ProbableFault.builder()
                .faultCategory(faultCategory)
                .faultDescription(description)
                .probability(Math.round(probability * 100.0) / 100.0) // Round to 2 decimal places
                .basedOnCases(stats.getCount())
                .confidenceLevel(confidenceLevel)
                .reasoning(reasoning)
                .build();
    }

    /**
     * Determine confidence level based on sample size and similarity
     */
    private String determineConfidenceLevel(int sampleSize, double avgSimilarity) {
        if (sampleSize >= 20 && avgSimilarity >= 0.7) {
            return "HIGH";
        } else if (sampleSize >= 10 && avgSimilarity >= 0.5) {
            return "MEDIUM";
        } else if (sampleSize >= 5) {
            return "LOW";
        } else {
            return "VERY_LOW";
        }
    }

    /**
     * Generate reasoning explanation
     */
    private String generateReasoning(String faultCategory, FaultStatistics stats, int totalCases) {
        double percentage = (stats.getCount() * 100.0) / totalCases;
        double successRate = (stats.getSuccessCount() * 100.0) / stats.getCount();

        StringBuilder reasoning = new StringBuilder();
        reasoning.append(String.format("Found in %d out of %d similar cases (%.1f%%). ", 
                stats.getCount(), totalCases, percentage));
        
        reasoning.append(String.format("Historical success rate: %.1f%%. ", successRate));
        
        if (stats.getAverageSimilarity() >= 0.7) {
            reasoning.append("High symptom similarity with historical cases.");
        } else if (stats.getAverageSimilarity() >= 0.5) {
            reasoning.append("Moderate symptom similarity with historical cases.");
        } else {
            reasoning.append("Lower symptom similarity - consider as secondary possibility.");
        }

        return reasoning.toString();
    }

    /**
     * Get human-readable fault description
     */
    private String getFaultDescription(String faultCategory) {
        Map<String, String> descriptions = Map.ofEntries(
                Map.entry("BATTERY", "Battery degradation or charging issues"),
                Map.entry("DISPLAY", "Screen, LCD, or backlight problems"),
                Map.entry("CHARGING", "Charging port or power IC issues"),
                Map.entry("MOTHERBOARD", "Logic board or circuit problems"),
                Map.entry("CAMERA", "Camera module malfunction"),
                Map.entry("AUDIO", "Speaker or microphone issues"),
                Map.entry("BUTTON", "Physical button malfunction"),
                Map.entry("CONNECTIVITY", "WiFi, Bluetooth, or cellular issues"),
                Map.entry("SOFTWARE", "Operating system or firmware problems"),
                Map.entry("WATER_DAMAGE", "Liquid damage or corrosion"),
                Map.entry("PHYSICAL_DAMAGE", "Physical trauma or cracks"),
                Map.entry("OTHER", "Other hardware or software issues")
        );

        return descriptions.getOrDefault(faultCategory, faultCategory);
    }

    /**
     * Internal class to track fault statistics
     */
    @lombok.Data
    private static class FaultStatistics {
        private int count = 0;
        private int successCount = 0;
        private List<Double> similarityScores = new ArrayList<>();
        private List<String> diagnosisExamples = new ArrayList<>();

        public void incrementCount() {
            count++;
        }

        public void incrementSuccessCount() {
            successCount++;
        }

        public void addSimilarityScore(double score) {
            similarityScores.add(score);
        }

        public void addDiagnosisExample(String diagnosis) {
            if (diagnosisExamples.size() < 3) { // Keep only top 3 examples
                diagnosisExamples.add(diagnosis);
            }
        }

        public double getAverageSimilarity() {
            if (similarityScores.isEmpty()) {
                return 0.0;
            }
            return similarityScores.stream()
                    .mapToDouble(Double::doubleValue)
                    .average()
                    .orElse(0.0);
        }
    }
}
