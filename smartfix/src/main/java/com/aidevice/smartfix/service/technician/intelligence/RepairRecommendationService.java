package com.aidevice.smartfix.service.technician.intelligence;

import com.aidevice.smartfix.dto.technician.TechnicianAssistDtos.*;
import com.aidevice.smartfix.model.RepairCase;
import com.aidevice.smartfix.model.RepairCasePart;
import com.aidevice.smartfix.repository.RepairCaseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for generating intelligent repair recommendations.
 * Analyzes successful repair patterns and outcomes.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RepairRecommendationService {

    private final RepairCaseRepository repairCaseRepository;
    private final CaseSimilarityService similarityService;

    /**
     * Generate repair recommendations based on similar successful cases
     */
    @Transactional(readOnly = true)
    public List<RepairRecommendation> generateRecommendations(AssistanceRequest request) {
        log.info("Generating repair recommendations for: {} {}", request.getDeviceType(), request.getBrand());

        // Find similar successful cases
        SimilarCaseSearchRequest searchRequest = SimilarCaseSearchRequest.builder()
                .deviceType(request.getDeviceType())
                .brand(request.getBrand())
                .model(request.getModel())
                .symptoms(request.getSymptoms())
                .limit(30)
                .minSimilarity(0.3)
                .excludeReturned(true) // Only successful repairs
                .build();

        List<SimilarCase> similarCases = similarityService.findSimilarCases(searchRequest);

        if (similarCases.isEmpty()) {
            log.warn("No similar successful cases found for recommendations");
            return Collections.emptyList();
        }

        // Get full repair case details
        List<Long> caseIds = similarCases.stream()
                .map(SimilarCase::getCaseId)
                .collect(Collectors.toList());

        List<RepairCase> repairCases = repairCaseRepository.findAllById(caseIds);

        // Analyze repair solutions
        Map<String, RepairSolutionStats> solutionStats = analyzeSolutions(repairCases);

        // Generate recommendations
        List<RepairRecommendation> recommendations = solutionStats.entrySet().stream()
                .map(entry -> createRecommendation(entry.getKey(), entry.getValue(), repairCases.size()))
                .sorted(Comparator.comparingDouble(RepairRecommendation::getSuccessRate).reversed())
                .limit(5)
                .collect(Collectors.toList());

        // Assign priorities
        assignPriorities(recommendations);

        log.info("Generated {} repair recommendations", recommendations.size());
        return recommendations;
    }

    /**
     * Analyze repair solutions from cases
     */
    private Map<String, RepairSolutionStats> analyzeSolutions(List<RepairCase> repairCases) {
        Map<String, RepairSolutionStats> solutionStats = new HashMap<>();

        for (RepairCase repairCase : repairCases) {
            String solution = extractSolutionKey(repairCase);
            if (solution == null || solution.isBlank()) {
                continue;
            }

            RepairSolutionStats stats = solutionStats.computeIfAbsent(
                    solution,
                    k -> new RepairSolutionStats(solution)
            );

            stats.incrementCount();
            
            if (!repairCase.isReturnedAfterRepair()) {
                stats.incrementSuccessCount();
            }

            if (repairCase.getRepairDurationMinutes() != null) {
                stats.addDuration(repairCase.getRepairDurationMinutes());
            }

            // Collect parts used
            for (RepairCasePart part : repairCase.getParts()) {
                if (part.isWasReplacement()) {
                    stats.addPart(part.getPartName());
                }
            }

            // Collect procedure details
            if (repairCase.getSolutionSummary() != null && !repairCase.getSolutionSummary().isBlank()) {
                stats.addProcedureExample(repairCase.getSolutionSummary());
            }
        }

        return solutionStats;
    }

    /**
     * Extract solution key from repair case
     */
    private String extractSolutionKey(RepairCase repairCase) {
        // Try to extract main action from solution summary
        String solution = repairCase.getSolutionSummary();
        if (solution == null || solution.isBlank()) {
            // Fallback to parts replaced
            if (!repairCase.getParts().isEmpty()) {
                String mainPart = repairCase.getParts().get(0).getPartName();
                return "Replace " + mainPart;
            }
            return null;
        }

        // Normalize solution text
        solution = solution.toLowerCase().trim();
        
        // Extract key action (first sentence or main verb phrase)
        String[] sentences = solution.split("[.!?]");
        if (sentences.length > 0) {
            return capitalizeFirst(sentences[0].trim());
        }

        return capitalizeFirst(solution);
    }

    /**
     * Create recommendation from statistics
     */
    private RepairRecommendation createRecommendation(String solution, RepairSolutionStats stats, int totalCases) {
        double successRate = (stats.getSuccessCount() * 100.0) / stats.getCount();
        int averageDuration = stats.getAverageDuration();
        
        String confidenceLevel = determineConfidenceLevel(stats.getCount(), successRate);
        String description = generateDescription(solution, stats);
        String procedure = generateProcedure(stats);

        return RepairRecommendation.builder()
                .repairAction(solution)
                .description(description)
                .successRate(Math.round(successRate * 100.0) / 100.0)
                .basedOnCases(stats.getCount())
                .averageDuration(averageDuration)
                .requiredParts(new ArrayList<>(stats.getCommonParts()))
                .procedure(procedure)
                .confidenceLevel(confidenceLevel)
                .priority(0) // Will be assigned later
                .build();
    }

    /**
     * Determine confidence level
     */
    private String determineConfidenceLevel(int sampleSize, double successRate) {
        if (sampleSize >= 10 && successRate >= 80.0) {
            return "HIGH";
        } else if (sampleSize >= 5 && successRate >= 70.0) {
            return "MEDIUM";
        } else if (sampleSize >= 3) {
            return "LOW";
        } else {
            return "VERY_LOW";
        }
    }

    /**
     * Generate description
     */
    private String generateDescription(String solution, RepairSolutionStats stats) {
        double successRate = (stats.getSuccessCount() * 100.0) / stats.getCount();
        
        StringBuilder desc = new StringBuilder();
        desc.append(String.format("This repair approach was successful in %.1f%% of %d similar cases. ",
                successRate, stats.getCount()));
        
        if (stats.getAverageDuration() > 0) {
            desc.append(String.format("Average repair time: %d minutes. ", stats.getAverageDuration()));
        }

        if (!stats.getCommonParts().isEmpty()) {
            desc.append("Commonly requires: ");
            desc.append(String.join(", ", stats.getCommonParts()));
            desc.append(".");
        }

        return desc.toString();
    }

    /**
     * Generate procedure from examples
     */
    private String generateProcedure(RepairSolutionStats stats) {
        if (stats.getProcedureExamples().isEmpty()) {
            return "Follow standard repair procedures for this type of repair.";
        }

        // Return the most common procedure example
        return stats.getProcedureExamples().get(0);
    }

    /**
     * Assign priorities to recommendations
     */
    private void assignPriorities(List<RepairRecommendation> recommendations) {
        for (int i = 0; i < recommendations.size(); i++) {
            recommendations.get(i).setPriority(i + 1);
        }
    }

    /**
     * Capitalize first letter
     */
    private String capitalizeFirst(String text) {
        if (text == null || text.isEmpty()) {
            return text;
        }
        return text.substring(0, 1).toUpperCase() + text.substring(1);
    }

    /**
     * Internal class to track repair solution statistics
     */
    @lombok.Data
    private static class RepairSolutionStats {
        private final String solution;
        private int count = 0;
        private int successCount = 0;
        private List<Integer> durations = new ArrayList<>();
        private Map<String, Integer> partFrequency = new HashMap<>();
        private List<String> procedureExamples = new ArrayList<>();

        public RepairSolutionStats(String solution) {
            this.solution = solution;
        }

        public void incrementCount() {
            count++;
        }

        public void incrementSuccessCount() {
            successCount++;
        }

        public void addDuration(int duration) {
            durations.add(duration);
        }

        public void addPart(String partName) {
            partFrequency.put(partName, partFrequency.getOrDefault(partName, 0) + 1);
        }

        public void addProcedureExample(String procedure) {
            if (procedureExamples.size() < 3) {
                procedureExamples.add(procedure);
            }
        }

        public int getAverageDuration() {
            if (durations.isEmpty()) {
                return 0;
            }
            return (int) durations.stream()
                    .mapToInt(Integer::intValue)
                    .average()
                    .orElse(0.0);
        }

        public List<String> getCommonParts() {
            // Return parts that appear in at least 30% of cases
            int threshold = Math.max(1, count * 30 / 100);
            
            return partFrequency.entrySet().stream()
                    .filter(entry -> entry.getValue() >= threshold)
                    .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                    .map(Map.Entry::getKey)
                    .limit(5)
                    .collect(Collectors.toList());
        }
    }
}
