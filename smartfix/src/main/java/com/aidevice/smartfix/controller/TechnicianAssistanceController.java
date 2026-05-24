package com.aidevice.smartfix.controller;

import com.aidevice.smartfix.dto.technician.TechnicianAssistDtos.*;
import com.aidevice.smartfix.service.technician.intelligence.TechnicianAssistanceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for AI Technician Assistant
 * Provides case-based reasoning and repair recommendations
 */
@RestController
@RequestMapping("/api/technician-assistance")
@RequiredArgsConstructor
@Slf4j
public class TechnicianAssistanceController {

    private final TechnicianAssistanceService assistanceService;

    /**
     * Get comprehensive AI analysis for a repair case
     * POST /api/technician-assistance/analyze
     */
    @PostMapping("/analyze")
    public ResponseEntity<AssistanceResponse> analyzeRepairCase(@RequestBody AssistanceRequest request) {
        log.info("Received assistance request for: {} {} - {}", 
                request.getDeviceType(), 
                request.getBrand(),
                request.getSymptoms().substring(0, Math.min(50, request.getSymptoms().length())));
        
        AssistanceResponse response = assistanceService.analyzeRepairCase(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Find similar past repair cases
     * POST /api/technician-assistance/similar-cases
     */
    @PostMapping("/similar-cases")
    public ResponseEntity<List<SimilarCase>> findSimilarCases(@RequestBody SimilarCaseSearchRequest request) {
        log.info("Searching for similar cases: {} {}", request.getDeviceType(), request.getBrand());
        
        List<SimilarCase> similarCases = assistanceService.findSimilarCases(request);
        return ResponseEntity.ok(similarCases);
    }

    /**
     * Get fault predictions only
     * POST /api/technician-assistance/predict-faults
     */
    @PostMapping("/predict-faults")
    public ResponseEntity<List<ProbableFault>> predictFaults(@RequestBody FaultPredictionRequest request) {
        log.info("Predicting faults for: {} {}", request.getDeviceType(), request.getBrand());
        
        List<ProbableFault> faults = assistanceService.predictFaults(request);
        return ResponseEntity.ok(faults);
    }

    /**
     * Get component predictions only
     * POST /api/technician-assistance/predict-components
     */
    @PostMapping("/predict-components")
    public ResponseEntity<List<ComponentPrediction>> predictComponents(@RequestBody ComponentPredictionRequest request) {
        log.info("Predicting components for: {} {}", request.getDeviceType(), request.getBrand());
        
        List<ComponentPrediction> components = assistanceService.predictComponents(request);
        return ResponseEntity.ok(components);
    }

    /**
     * Get repair recommendations only
     * POST /api/technician-assistance/recommendations
     */
    @PostMapping("/recommendations")
    public ResponseEntity<List<RepairRecommendation>> getRecommendations(@RequestBody AssistanceRequest request) {
        log.info("Getting recommendations for: {} {}", request.getDeviceType(), request.getBrand());
        
        List<RepairRecommendation> recommendations = assistanceService.getRecommendations(request);
        return ResponseEntity.ok(recommendations);
    }

    /**
     * Get risk warnings only
     * POST /api/technician-assistance/risk-warnings
     */
    @PostMapping("/risk-warnings")
    public ResponseEntity<List<RiskWarning>> getRiskWarnings(@RequestBody AssistanceRequest request) {
        log.info("Analyzing risks for: {} {}", request.getDeviceType(), request.getBrand());
        
        List<RiskWarning> warnings = assistanceService.getRiskWarnings(request);
        return ResponseEntity.ok(warnings);
    }

    /**
     * Get repair patterns only
     * POST /api/technician-assistance/patterns
     */
    @PostMapping("/patterns")
    public ResponseEntity<List<RepairPattern>> getPatterns(@RequestBody PatternDetectionRequest request) {
        log.info("Detecting patterns for: {}", request.getDeviceType());
        
        List<RepairPattern> patterns = assistanceService.getPatterns(request);
        return ResponseEntity.ok(patterns);
    }
}
