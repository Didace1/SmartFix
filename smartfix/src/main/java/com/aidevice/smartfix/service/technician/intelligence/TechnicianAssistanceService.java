package com.aidevice.smartfix.service.technician.intelligence;

import com.aidevice.smartfix.dto.technician.TechnicianAssistDtos.*;
import com.aidevice.smartfix.repository.RepairCaseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Main orchestrator service for AI Technician Assistant.
 * Coordinates all intelligence services to provide comprehensive assistance.
 * Module 2: AI Technician Assistant
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TechnicianAssistanceService {

    private final CaseSimilarityService similarityService;
    private final FaultHypothesisService faultHypothesisService;
    private final ComponentPredictionService componentPredictionService;
    private final RepairRecommendationService recommendationService;
    private final RepairRiskAnalysisService riskAnalysisService;
    private final RepairPatternDetectionService patternDetectionService;
    private final RepairCaseRepository repairCaseRepository;

    /**
     * Perform comprehensive AI analysis for technician assistance
     */
    @Transactional(readOnly = true)
    public AssistanceResponse analyzeRepairCase(AssistanceRequest request) {
        log.info("Starting AI analysis for: {} {} - {}", 
                request.getDeviceType(), 
                request.getBrand(), 
                request.getSymptoms().substring(0, Math.min(50, request.getSymptoms().length())));

        long startTime = System.currentTimeMillis();

        // 1. Find similar cases
        log.debug("Finding similar cases...");
        SimilarCaseSearchRequest searchRequest = SimilarCaseSearchRequest.builder()
                .deviceType(request.getDeviceType())
                .brand(request.getBrand())
                .model(request.getModel())
                .symptoms(request.getSymptoms())
                .limit(request.getMaxSimilarCases())
                .minSimilarity(request.getMinSimilarityScore())
                .excludeReturned(false)
                .build();
        List<SimilarCase> similarCases = similarityService.findSimilarCases(searchRequest);

        // 2. Predict probable faults
        log.debug("Predicting probable faults...");
        FaultPredictionRequest faultRequest = FaultPredictionRequest.builder()
                .deviceType(request.getDeviceType())
                .brand(request.getBrand())
                .symptoms(request.getSymptoms())
                .topN(5)
                .build();
        List<ProbableFault> probableFaults = faultHypothesisService.predictProbableFaults(faultRequest);

        // 3. Predict component failures
        log.debug("Predicting component failures...");
        ComponentPredictionRequest componentRequest = ComponentPredictionRequest.builder()
                .deviceType(request.getDeviceType())
                .brand(request.getBrand())
                .model(request.getModel())
                .topN(5)
                .minFailureRate(10.0)
                .build();
        List<ComponentPrediction> componentPredictions = componentPredictionService
                .predictFailingComponents(componentRequest);

        // 4. Generate repair recommendations
        log.debug("Generating repair recommendations...");
        List<RepairRecommendation> recommendations = recommendationService
                .generateRecommendations(request);

        // 5. Analyze repair risks
        log.debug("Analyzing repair risks...");
        List<RiskWarning> riskWarnings = riskAnalysisService.analyzeRepairRisks(request);

        // 6. Detect patterns
        log.debug("Detecting repair patterns...");
        List<RepairPattern> patterns = patternDetectionService
                .searchPatternsBySymptoms(request.getDeviceType(), request.getSymptoms(), 5);

        // 7. Generate analytics summary
        log.debug("Generating analytics summary...");
        AnalyticsSummary analytics = generateAnalyticsSummary(request, similarCases);

        // 8. Generate confidence note
        String confidenceNote = generateConfidenceNote(similarCases.size(), analytics);

        long duration = System.currentTimeMillis() - startTime;
        log.info("AI analysis completed in {}ms. Found {} similar cases, {} faults, {} components, {} recommendations",
                duration, similarCases.size(), probableFaults.size(), 
                componentPredictions.size(), recommendations.size());

        // Build response
        return AssistanceResponse.builder()
                .deviceInfo(DeviceInfo.builder()
                        .deviceType(request.getDeviceType())
                        .brand(request.getBrand())
                        .model(request.getModel())
                        .symptoms(request.getSymptoms())
                        .inspectionNotes(request.getInspectionNotes())
                        .build())
                .probableFaults(probableFaults)
                .componentPredictions(componentPredictions)
                .repairRecommendations(recommendations)
                .riskWarnings(riskWarnings)
                .similarCases(similarCases)
                .detectedPatterns(patterns)
                .analytics(analytics)
                .confidenceNote(confidenceNote)
                .build();
    }

    /**
     * Generate analytics summary
     */
    private AnalyticsSummary generateAnalyticsSummary(AssistanceRequest request, List<SimilarCase> similarCases) {
        // Get total historical cases for this device type
        long totalCases = repairCaseRepository.countByDeviceType(request.getDeviceType());

        // Calculate average success rate from similar cases
        double avgSuccessRate = similarCases.stream()
                .filter(sc -> sc.getWasSuccessful() != null)
                .mapToDouble(sc -> sc.getWasSuccessful() ? 100.0 : 0.0)
                .average()
                .orElse(0.0);

        // Calculate average return rate
        double avgReturnRate = similarCases.stream()
                .filter(sc -> sc.getWasReturned() != null)
                .mapToDouble(sc -> sc.getWasReturned() ? 100.0 : 0.0)
                .average()
                .orElse(0.0);

        // Calculate average repair duration
        int avgDuration = (int) similarCases.stream()
                .filter(sc -> sc.getRepairDuration() != null)
                .mapToInt(SimilarCase::getRepairDuration)
                .average()
                .orElse(0.0);

        return AnalyticsSummary.builder()
                .totalHistoricalCases((int) totalCases)
                .similarCasesFound(similarCases.size())
                .patternsDetected(0) // Will be set by pattern detection
                .averageSuccessRate(Math.round(avgSuccessRate * 100.0) / 100.0)
                .averageReturnRate(Math.round(avgReturnRate * 100.0) / 100.0)
                .averageRepairDuration(avgDuration)
                .build();
    }

    /**
     * Generate confidence note explaining the analysis
     */
    private String generateConfidenceNote(int similarCasesCount, AnalyticsSummary analytics) {
        StringBuilder note = new StringBuilder();

        note.append("📊 ANALYSIS CONFIDENCE: ");

        if (similarCasesCount >= 20) {
            note.append("HIGH - ");
        } else if (similarCasesCount >= 10) {
            note.append("MEDIUM - ");
        } else if (similarCasesCount >= 5) {
            note.append("LOW - ");
        } else {
            note.append("VERY LOW - ");
        }

        note.append(String.format("Based on %d similar historical cases. ", similarCasesCount));

        note.append("\n\n⚠️ IMPORTANT DISCLAIMER:\n");
        note.append("• These are PROBABLE predictions based on historical repair data\n");
        note.append("• NOT guaranteed diagnoses or automatic fault detection\n");
        note.append("• Always perform thorough diagnostic testing\n");
        note.append("• Use this as decision support, not replacement for expertise\n");
        note.append("• Actual fault may differ from predictions\n");

        note.append("\n\n📈 STATISTICAL BASIS:\n");
        note.append(String.format("• Total historical cases: %d\n", analytics.getTotalHistoricalCases()));
        note.append(String.format("• Similar cases found: %d\n", similarCasesCount));
        note.append(String.format("• Average success rate: %.1f%%\n", analytics.getAverageSuccessRate()));
        note.append(String.format("• Average return rate: %.1f%%\n", analytics.getAverageReturnRate()));

        if (similarCasesCount < 5) {
            note.append("\n\n⚠️ LIMITED DATA WARNING:\n");
            note.append("Very few similar cases found. Predictions may be less reliable. ");
            note.append("Consider consulting senior technician or manufacturer documentation.");
        }

        return note.toString();
    }

    /**
     * Get similar cases only (lightweight operation)
     */
    @Transactional(readOnly = true)
    public List<SimilarCase> findSimilarCases(SimilarCaseSearchRequest request) {
        return similarityService.findSimilarCases(request);
    }

    /**
     * Get fault predictions only
     */
    @Transactional(readOnly = true)
    public List<ProbableFault> predictFaults(FaultPredictionRequest request) {
        return faultHypothesisService.predictProbableFaults(request);
    }

    /**
     * Get component predictions only
     */
    @Transactional(readOnly = true)
    public List<ComponentPrediction> predictComponents(ComponentPredictionRequest request) {
        return componentPredictionService.predictFailingComponents(request);
    }

    /**
     * Get repair recommendations only
     */
    @Transactional(readOnly = true)
    public List<RepairRecommendation> getRecommendations(AssistanceRequest request) {
        return recommendationService.generateRecommendations(request);
    }

    /**
     * Get risk warnings only
     */
    @Transactional(readOnly = true)
    public List<RiskWarning> getRiskWarnings(AssistanceRequest request) {
        return riskAnalysisService.analyzeRepairRisks(request);
    }

    /**
     * Get patterns only
     */
    @Transactional(readOnly = true)
    public List<RepairPattern> getPatterns(PatternDetectionRequest request) {
        return patternDetectionService.detectPatterns(request);
    }
}
