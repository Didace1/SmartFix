package com.aidevice.smartfix.dto.technician;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTOs for Module 2: AI Technician Assistant
 */
public class TechnicianAssistDtos {

    /**
     * Request DTO for AI analysis
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AssistanceRequest {
        
        @NotBlank(message = "Device type is required")
        @Size(max = 100)
        private String deviceType;
        
        @Size(max = 100)
        private String brand;
        
        @Size(max = 200)
        private String model;
        
        @NotBlank(message = "Symptoms are required")
        private String symptoms;
        
        private String inspectionNotes;
        
        @Builder.Default
        private Integer maxSimilarCases = 10;
        
        @Builder.Default
        private Double minSimilarityScore = 0.3;
    }

    /**
     * Response DTO for AI assistance
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AssistanceResponse {
        
        private DeviceInfo deviceInfo;
        private List<ProbableFault> probableFaults;
        private List<ComponentPrediction> componentPredictions;
        private List<RepairRecommendation> repairRecommendations;
        private List<RiskWarning> riskWarnings;
        private List<SimilarCase> similarCases;
        private List<RepairPattern> detectedPatterns;
        private AnalyticsSummary analytics;
        private String confidenceNote;
    }

    /**
     * Device information
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DeviceInfo {
        
        private String deviceType;
        private String brand;
        private String model;
        private String symptoms;
        private String inspectionNotes;
    }

    /**
     * Probable fault prediction
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProbableFault {
        
        private String faultCategory;
        private String faultDescription;
        private Double probability;
        private Integer basedOnCases;
        private String confidenceLevel;
        private String reasoning;
    }

    /**
     * Component failure prediction
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ComponentPrediction {
        
        private String componentName;
        private Double failureProbability;
        private Integer historicalFailures;
        private Integer historicalReplacements;
        private Double replacementRate;
        private String recommendation;
        private String confidenceLevel;
    }

    /**
     * Repair recommendation
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RepairRecommendation {
        
        private String repairAction;
        private String description;
        private Double successRate;
        private Integer basedOnCases;
        private Integer averageDuration;
        private List<String> requiredParts;
        private String procedure;
        private String confidenceLevel;
        private Integer priority;
    }

    /**
     * Risk warning
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RiskWarning {
        
        private String warningType;
        private String severity;
        private String message;
        private String recommendation;
        private Double returnRate;
        private Integer affectedCases;
        private String reasoning;
    }

    /**
     * Similar repair case
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SimilarCase {
        
        private Long caseId;
        private String deviceType;
        private String brand;
        private String model;
        private String symptoms;
        private String diagnosis;
        private String solution;
        private Boolean wasSuccessful;
        private Boolean wasReturned;
        private Integer repairDuration;
        private LocalDateTime repairDate;
        private Double similarityScore;
        private List<String> partsReplaced;
    }

    /**
     * Detected repair pattern
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RepairPattern {
        
        private String patternDescription;
        private String faultCategory;
        private String commonSolution;
        private Integer occurrenceCount;
        private BigDecimal successRate;
        private BigDecimal returnRate;
        private String confidenceLevel;
        private String recommendation;
    }

    /**
     * Analytics summary
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AnalyticsSummary {
        
        private Integer totalHistoricalCases;
        private Integer similarCasesFound;
        private Integer patternsDetected;
        private Double averageSuccessRate;
        private Double averageReturnRate;
        private Integer averageRepairDuration;
        private List<TrendData> repairTrends;
    }

    /**
     * Trend data
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TrendData {
        
        private String period;
        private Integer caseCount;
        private Double successRate;
        private Double returnRate;
    }

    /**
     * Search filters for similar cases
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SimilarCaseSearchRequest {
        
        @NotBlank
        private String deviceType;
        
        private String brand;
        private String model;
        
        @NotBlank
        private String symptoms;
        
        @Builder.Default
        private Integer limit = 10;
        
        @Builder.Default
        private Double minSimilarity = 0.3;
        
        private Boolean excludeReturned;
    }

    /**
     * Component prediction request
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ComponentPredictionRequest {
        
        @NotBlank
        private String deviceType;
        
        private String brand;
        private String model;
        
        @Builder.Default
        private Integer topN = 5;
        
        @Builder.Default
        private Double minFailureRate = 10.0;
    }

    /**
     * Fault prediction request
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FaultPredictionRequest {
        
        @NotBlank
        private String deviceType;
        
        private String brand;
        
        @NotBlank
        private String symptoms;
        
        @Builder.Default
        private Integer topN = 5;
    }

    /**
     * Pattern detection request
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PatternDetectionRequest {
        
        @NotBlank
        private String deviceType;
        
        private String brand;
        
        @Builder.Default
        private Integer minOccurrences = 3;
        
        @Builder.Default
        private Double minSuccessRate = 50.0;
    }
}
