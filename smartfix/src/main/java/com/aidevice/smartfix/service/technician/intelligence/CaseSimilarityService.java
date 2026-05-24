package com.aidevice.smartfix.service.technician.intelligence;

import com.aidevice.smartfix.dto.technician.TechnicianAssistDtos.*;
import com.aidevice.smartfix.model.RepairCase;
import com.aidevice.smartfix.repository.RepairCaseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for finding similar repair cases using text similarity algorithms.
 * Implements TF-IDF and Cosine Similarity for case-based reasoning.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CaseSimilarityService {

    private final RepairCaseRepository repairCaseRepository;

    /**
     * Find similar repair cases based on symptoms and device information
     */
    @Transactional(readOnly = true)
    public List<SimilarCase> findSimilarCases(SimilarCaseSearchRequest request) {
        log.info("Searching for similar cases: device={}, symptoms={}", 
                request.getDeviceType(), request.getSymptoms().substring(0, Math.min(50, request.getSymptoms().length())));

        // Get all cases for the device type
        List<RepairCase> candidateCases = repairCaseRepository.findByDeviceTypeAndBrand(
                request.getDeviceType(), 
                request.getBrand()
        );

        // Filter out returned cases if requested
        if (Boolean.TRUE.equals(request.getExcludeReturned())) {
            candidateCases = candidateCases.stream()
                    .filter(rc -> !rc.isReturnedAfterRepair())
                    .collect(Collectors.toList());
        }

        log.debug("Found {} candidate cases for similarity analysis", candidateCases.size());

        // Calculate similarity scores
        List<SimilarCaseWithScore> scoredCases = candidateCases.stream()
                .map(repairCase -> {
                    double score = calculateSimilarityScore(request, repairCase);
                    return new SimilarCaseWithScore(repairCase, score);
                })
                .filter(scs -> scs.score >= request.getMinSimilarity())
                .sorted(Comparator.comparingDouble(SimilarCaseWithScore::getScore).reversed())
                .limit(request.getLimit())
                .collect(Collectors.toList());

        log.info("Found {} similar cases above threshold {}", scoredCases.size(), request.getMinSimilarity());

        // Map to DTOs
        return scoredCases.stream()
                .map(this::mapToSimilarCase)
                .collect(Collectors.toList());
    }

    /**
     * Calculate overall similarity score between request and repair case
     */
    private double calculateSimilarityScore(SimilarCaseSearchRequest request, RepairCase repairCase) {
        // Weight factors for different similarity components
        final double SYMPTOM_WEIGHT = 0.5;
        final double DEVICE_WEIGHT = 0.2;
        final double MODEL_WEIGHT = 0.15;
        final double TEMPORAL_WEIGHT = 0.15;

        // Calculate individual similarity scores
        double symptomSimilarity = calculateTextSimilarity(
                request.getSymptoms(), 
                repairCase.getSymptomsText()
        );

        double deviceSimilarity = calculateDeviceMatchScore(
                request.getDeviceType(),
                request.getBrand(),
                request.getModel(),
                repairCase
        );

        double modelSimilarity = calculateModelSimilarity(
                request.getModel(),
                repairCase.getModel()
        );

        double temporalRelevance = calculateTemporalRelevance(repairCase.getRepairDate());

        // Weighted combination
        double totalScore = (symptomSimilarity * SYMPTOM_WEIGHT) +
                           (deviceSimilarity * DEVICE_WEIGHT) +
                           (modelSimilarity * MODEL_WEIGHT) +
                           (temporalRelevance * TEMPORAL_WEIGHT);

        log.debug("Similarity scores - Symptom: {}, Device: {}, Model: {}, Temporal: {}, Total: {}",
                symptomSimilarity, deviceSimilarity, modelSimilarity, temporalRelevance, totalScore);

        return totalScore;
    }

    /**
     * Calculate text similarity using cosine similarity with TF-IDF
     */
    private double calculateTextSimilarity(String text1, String text2) {
        if (text1 == null || text2 == null || text1.isBlank() || text2.isBlank()) {
            return 0.0;
        }

        // Normalize and tokenize
        List<String> tokens1 = tokenize(text1.toLowerCase());
        List<String> tokens2 = tokenize(text2.toLowerCase());

        if (tokens1.isEmpty() || tokens2.isEmpty()) {
            return 0.0;
        }

        // Create term frequency maps
        Map<String, Integer> tf1 = calculateTermFrequency(tokens1);
        Map<String, Integer> tf2 = calculateTermFrequency(tokens2);

        // Get all unique terms
        Set<String> allTerms = new HashSet<>();
        allTerms.addAll(tf1.keySet());
        allTerms.addAll(tf2.keySet());

        // Calculate cosine similarity
        double dotProduct = 0.0;
        double magnitude1 = 0.0;
        double magnitude2 = 0.0;

        for (String term : allTerms) {
            int freq1 = tf1.getOrDefault(term, 0);
            int freq2 = tf2.getOrDefault(term, 0);

            dotProduct += freq1 * freq2;
            magnitude1 += freq1 * freq1;
            magnitude2 += freq2 * freq2;
        }

        magnitude1 = Math.sqrt(magnitude1);
        magnitude2 = Math.sqrt(magnitude2);

        if (magnitude1 == 0.0 || magnitude2 == 0.0) {
            return 0.0;
        }

        return dotProduct / (magnitude1 * magnitude2);
    }

    /**
     * Tokenize text into words
     */
    private List<String> tokenize(String text) {
        // Remove punctuation and split by whitespace
        String cleaned = text.replaceAll("[^a-z0-9\\s]", " ");
        String[] words = cleaned.split("\\s+");
        
        // Filter out stopwords and short words
        return Arrays.stream(words)
                .filter(word -> word.length() > 2)
                .filter(word -> !isStopWord(word))
                .collect(Collectors.toList());
    }

    /**
     * Calculate term frequency
     */
    private Map<String, Integer> calculateTermFrequency(List<String> tokens) {
        Map<String, Integer> tf = new HashMap<>();
        for (String token : tokens) {
            tf.put(token, tf.getOrDefault(token, 0) + 1);
        }
        return tf;
    }

    /**
     * Check if word is a stopword
     */
    private boolean isStopWord(String word) {
        Set<String> stopWords = Set.of(
                "the", "and", "for", "with", "this", "that", "from", "have", "been",
                "will", "would", "could", "should", "about", "after", "before", "when",
                "where", "what", "which", "who", "how", "not", "but", "can", "are", "was"
        );
        return stopWords.contains(word);
    }

    /**
     * Calculate device match score
     */
    private double calculateDeviceMatchScore(String reqDeviceType, String reqBrand, 
                                             String reqModel, RepairCase repairCase) {
        double score = 0.0;

        // Device type match (most important)
        if (reqDeviceType != null && reqDeviceType.equalsIgnoreCase(repairCase.getDeviceType())) {
            score += 0.5;
        }

        // Brand match
        if (reqBrand != null && repairCase.getBrand() != null && 
            reqBrand.equalsIgnoreCase(repairCase.getBrand())) {
            score += 0.3;
        }

        // Model match
        if (reqModel != null && repairCase.getModel() != null && 
            reqModel.equalsIgnoreCase(repairCase.getModel())) {
            score += 0.2;
        }

        return score;
    }

    /**
     * Calculate model similarity (partial matching)
     */
    private double calculateModelSimilarity(String model1, String model2) {
        if (model1 == null || model2 == null) {
            return 0.0;
        }

        model1 = model1.toLowerCase();
        model2 = model2.toLowerCase();

        // Exact match
        if (model1.equals(model2)) {
            return 1.0;
        }

        // Partial match (one contains the other)
        if (model1.contains(model2) || model2.contains(model1)) {
            return 0.7;
        }

        // Check for common tokens
        Set<String> tokens1 = new HashSet<>(Arrays.asList(model1.split("\\s+")));
        Set<String> tokens2 = new HashSet<>(Arrays.asList(model2.split("\\s+")));
        
        Set<String> intersection = new HashSet<>(tokens1);
        intersection.retainAll(tokens2);
        
        Set<String> union = new HashSet<>(tokens1);
        union.addAll(tokens2);

        if (union.isEmpty()) {
            return 0.0;
        }

        return (double) intersection.size() / union.size();
    }

    /**
     * Calculate temporal relevance (more recent cases are more relevant)
     */
    private double calculateTemporalRelevance(LocalDateTime repairDate) {
        if (repairDate == null) {
            return 0.5; // Default relevance for unknown dates
        }

        long daysSinceRepair = ChronoUnit.DAYS.between(repairDate, LocalDateTime.now());

        // Exponential decay: newer cases are more relevant
        // Cases within 30 days: 1.0
        // Cases within 90 days: 0.8
        // Cases within 180 days: 0.6
        // Cases within 365 days: 0.4
        // Older cases: 0.2

        if (daysSinceRepair <= 30) return 1.0;
        if (daysSinceRepair <= 90) return 0.8;
        if (daysSinceRepair <= 180) return 0.6;
        if (daysSinceRepair <= 365) return 0.4;
        return 0.2;
    }

    /**
     * Map repair case to similar case DTO
     */
    private SimilarCase mapToSimilarCase(SimilarCaseWithScore scoredCase) {
        RepairCase rc = scoredCase.repairCase;
        
        List<String> partsReplaced = rc.getParts().stream()
                .filter(part -> part.isWasReplacement())
                .map(part -> part.getPartName())
                .collect(Collectors.toList());

        return SimilarCase.builder()
                .caseId(rc.getCaseId())
                .deviceType(rc.getDeviceType())
                .brand(rc.getBrand())
                .model(rc.getModel())
                .symptoms(rc.getSymptomsText())
                .diagnosis(rc.getDiagnosisText())
                .solution(rc.getSolutionSummary())
                .wasSuccessful(!rc.isReturnedAfterRepair())
                .wasReturned(rc.isReturnedAfterRepair())
                .repairDuration(rc.getRepairDurationMinutes())
                .repairDate(rc.getRepairDate())
                .similarityScore(scoredCase.score)
                .partsReplaced(partsReplaced)
                .build();
    }

    /**
     * Internal class to hold repair case with similarity score
     */
    @lombok.Data
    @lombok.AllArgsConstructor
    private static class SimilarCaseWithScore {
        private RepairCase repairCase;
        private double score;
    }
}
