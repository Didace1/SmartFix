package com.aidevice.smartfix.controller;

import com.aidevice.smartfix.dto.technician.RepairKnowledgeDtos.*;
import com.aidevice.smartfix.service.technician.knowledge.RepairKnowledgeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Module 1: Repair Knowledge Management
 * Handles CRUD operations for repair cases and diagnostic knowledge
 */
@RestController
@RequestMapping("/api/repair-knowledge")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class RepairKnowledgeController {

    private final RepairKnowledgeService repairKnowledgeService;

    /**
     * Create a new repair case
     */
    @PostMapping("/cases")
    public ResponseEntity<RepairCaseResponse> createRepairCase(
            @Valid @RequestBody RepairCaseRequest request) {
        log.info("POST /api/repair-knowledge/cases - Creating repair case for ticket: {}", 
                request.getRepairTicketId());
        
        try {
            RepairCaseResponse response = repairKnowledgeService.createRepairCase(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            log.error("Invalid request: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (IllegalStateException e) {
            log.error("Conflict: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    /**
     * Update existing repair case
     */
    @PutMapping("/cases/{caseId}")
    public ResponseEntity<RepairCaseResponse> updateRepairCase(
            @PathVariable Long caseId,
            @Valid @RequestBody RepairCaseRequest request) {
        log.info("PUT /api/repair-knowledge/cases/{} - Updating repair case", caseId);
        
        try {
            RepairCaseResponse response = repairKnowledgeService.updateRepairCase(caseId, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("Case not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get repair case by ID
     */
    @GetMapping("/cases/{caseId}")
    public ResponseEntity<RepairCaseResponse> getRepairCase(@PathVariable Long caseId) {
        log.info("GET /api/repair-knowledge/cases/{}", caseId);
        
        try {
            RepairCaseResponse response = repairKnowledgeService.getRepairCase(caseId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("Case not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get all repair cases with pagination
     */
    @GetMapping("/cases")
    public ResponseEntity<Page<RepairCaseResponse>> getAllRepairCases(Pageable pageable) {
        log.info("GET /api/repair-knowledge/cases - Page: {}, Size: {}", 
                pageable.getPageNumber(), pageable.getPageSize());
        
        Page<RepairCaseResponse> cases = repairKnowledgeService.getAllRepairCases(pageable);
        return ResponseEntity.ok(cases);
    }

    /**
     * Get repair history for a device
     */
    @GetMapping("/history")
    public ResponseEntity<List<RepairHistorySummary>> getRepairHistory(
            @RequestParam String deviceType,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String model) {
        log.info("GET /api/repair-knowledge/history - Device: {} {} {}", deviceType, brand, model);
        
        List<RepairHistorySummary> history = repairKnowledgeService.getRepairHistory(
                deviceType, brand, model
        );
        return ResponseEntity.ok(history);
    }

    /**
     * Delete repair case
     */
    @DeleteMapping("/cases/{caseId}")
    public ResponseEntity<Void> deleteRepairCase(@PathVariable Long caseId) {
        log.info("DELETE /api/repair-knowledge/cases/{}", caseId);
        
        try {
            repairKnowledgeService.deleteRepairCase(caseId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error deleting case: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Add parts to repair case
     */
    @PostMapping("/cases/{caseId}/parts")
    public ResponseEntity<Void> addPartsToCase(
            @PathVariable Long caseId,
            @Valid @RequestBody List<RepairPartRequest> parts) {
        log.info("POST /api/repair-knowledge/cases/{}/parts - Adding {} parts", caseId, parts.size());
        
        try {
            repairKnowledgeService.addPartsToCase(caseId, parts);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            log.error("Case not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get repair statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<RepairStatistics> getRepairStatistics() {
        log.info("GET /api/repair-knowledge/statistics");
        
        RepairStatistics stats = repairKnowledgeService.getRepairStatistics();
        return ResponseEntity.ok(stats);
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Repair Knowledge Management API is running");
    }
}
