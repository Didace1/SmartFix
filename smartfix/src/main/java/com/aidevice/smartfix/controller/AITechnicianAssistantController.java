package com.aidevice.smartfix.controller;

import com.aidevice.smartfix.dto.technician.TechnicianAssistDtos.*;
import com.aidevice.smartfix.service.technician.intelligence.TechnicianAssistanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Module 2: AI Technician Assistant
 * Provides intelligent repair assistance and recommendations
 */
@RestController
@RequestMapping("/api/technician-assist")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AITechnicianAssistantController {

    private final TechnicianAssistanceService assistanceService;

    /**
     * Perform comprehensive AI analysis
     * This is the main endpoint that provides all assistance features
     */
    @PostMapping("/analyze")
    public ResponseEntity<AssistanceResponse> analyzeRepairCase(
            @Valid @RequestBody AssistanceRequest request) {
        log.info("POST /api/technician-assist/analyze - Device: {} {}, Symptoms length: {}", 
                request.getDeviceType(), request.getBrand(), request.getSymptoms().length());
        
        try {
            AssistanceResponse response = assistanceService.analyzeRepairCase(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error during AI analysis: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Find similar repair cases
     */
    @PostMapping("/similar-cases")
    public ResponseEntity<List<SimilarCase>> findSimilarCases(
            @Valid @RequestBody SimilarCaseSearchRequest request) {
        log.info("POST /api/technician-assist/similar-cases - Device: {}", request.getDeviceType());
        
        try {
            List<SimilarCase> cases = assistanceService.findSimilarCases(request);
            return ResponseEntity.ok(cases);
        } catch (Exception e) {
            log.error("Error finding similar cases: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get fault predictions
     */
    @PostMapping("/fault-predictions")
    public ResponseEntity<List<ProbableFault>> predictFaults(
            @Valid @RequestBody FaultPredictionRequest request) {
        log.info("POST /api/technician-assist/fault-predictions - Device: {}", request.getDeviceType());
        
        try {
            List<ProbableFault> faults = assistanceService.predictFaults(request);
            return ResponseEntity.ok(faults);
        } catch (Exception e) {
            log.error("Error predicting faults: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get component failure predictions
     */
    @PostMapping("/component-predictions")
    public ResponseEntity<List<ComponentPrediction>> predictComponents(
            @Valid @RequestBody ComponentPredictionRequest request) {
        log.info("POST /api/technician-assist/component-predictions - Device: {}", request.getDeviceType());
        
        try {
            List<ComponentPrediction> predictions = assistanceService.predictComponents(request);
            return ResponseEntity.ok(predictions);
        } catch (Exception e) {
            log.error("Error predicting components: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get repair recommendations
     */
    @PostMapping("/repair-recommendations")
    public ResponseEntity<List<RepairRecommendation>> getRecommendations(
            @Valid @RequestBody AssistanceRequest request) {
        log.info("POST /api/technician-assist/repair-recommendations - Device: {}", request.getDeviceType());
        
        try {
            List<RepairRecommendation> recommendations = assistanceService.getRecommendations(request);
            return ResponseEntity.ok(recommendations);
        } catch (Exception e) {
            log.error("Error generating recommendations: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get risk warnings
     */
    @PostMapping("/risk-warnings")
    public ResponseEntity<List<RiskWarning>> getRiskWarnings(
            @Valid @RequestBody AssistanceRequest request) {
        log.info("POST /api/technician-assist/risk-warnings - Device: {}", request.getDeviceType());
        
        try {
            List<RiskWarning> warnings = assistanceService.getRiskWarnings(request);
            return ResponseEntity.ok(warnings);
        } catch (Exception e) {
            log.error("Error analyzing risks: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Detect repair patterns
     */
    @PostMapping("/patterns")
    public ResponseEntity<List<RepairPattern>> detectPatterns(
            @Valid @RequestBody PatternDetectionRequest request) {
        log.info("POST /api/technician-assist/patterns - Device: {}", request.getDeviceType());
        
        try {
            List<RepairPattern> patterns = assistanceService.getPatterns(request);
            return ResponseEntity.ok(patterns);
        } catch (Exception e) {
            log.error("Error detecting patterns: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("AI Technician Assistant API is running");
    }

    /**
     * Get API information
     */
    @GetMapping("/info")
    public ResponseEntity<ApiInfo> getApiInfo() {
        ApiInfo info = new ApiInfo(
                "SmartFix AI Technician Assistant",
                "2.0",
                "Provides intelligent repair assistance using Case-Based Reasoning and historical repair analytics",
                List.of(
                        "Similar case search",
                        "Fault hypothesis generation",
                        "Component failure prediction",
                        "Repair recommendations",
                        "Risk analysis",
                        "Pattern detection"
                )
        );
        return ResponseEntity.ok(info);
    }

    /**
     * API Info DTO
     */
    record ApiInfo(
            String name,
            String version,
            String description,
            List<String> features
    ) {}
}
