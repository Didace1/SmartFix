package com.aidevice.smartfix.service.technician.knowledge;

import com.aidevice.smartfix.dto.technician.RepairKnowledgeDtos.*;
import com.aidevice.smartfix.model.*;
import com.aidevice.smartfix.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing repair knowledge and diagnostic cases.
 * Module 1: Repair Knowledge Management
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RepairKnowledgeService {

    private final RepairCaseRepository repairCaseRepository;
    private final RepairCasePartRepository repairCasePartRepository;
    private final RepairTaskRepository repairTaskRepository;
    private final UserRepository userRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final ComponentFailureHistoryRepository componentFailureHistoryRepository;

    /**
     * Create a new repair case with diagnostic information
     */
    @Transactional
    public RepairCaseResponse createRepairCase(RepairCaseRequest request) {
        log.info("Creating repair case for ticket ID: {}", request.getRepairTicketId());

        // Repair ticket is optional - can be standalone knowledge recording
        RepairTask repairTask = null;
        if (request.getRepairTicketId() != null) {
            repairTask = repairTaskRepository.findById(request.getRepairTicketId()).orElse(null);
            
            // Check if case already exists for this ticket
            if (repairTask != null && repairCaseRepository.findByRepairTicket(repairTask).isPresent()) {
                throw new IllegalStateException("Repair case already exists for ticket: " + request.getRepairTicketId());
            }
        }

        // Get technician if provided
        User technician = null;
        if (request.getTechnicianId() != null) {
            technician = userRepository.findById(request.getTechnicianId()).orElse(null);
        }

        // Build repair case
        RepairCase repairCase = RepairCase.builder()
                .repairTicket(repairTask)  // Can be null for standalone recording
                .deviceType(request.getDeviceType())
                .brand(request.getBrand())
                .model(request.getModel())
                .symptomsText(request.getSymptomsText())
                .inspectionNotes(request.getInspectionNotes())
                .diagnosisText(request.getDiagnosisText())
                .predictedFault(request.getPredictedFault())
                .finalFaultCode(request.getFaultCategory())
                .solutionSummary(request.getSolutionSummary())
                .repairStatus(request.getRepairStatus())
                .returnedAfterRepair(request.getReturnedAfterRepair() != null ? request.getReturnedAfterRepair() : false)
                .returnReason(request.getReturnReason())
                .repairDurationMinutes(request.getRepairDurationMinutes())
                .technicianNotes(request.getTechnicianNotes())
                .technician(technician)
                .repairDate(request.getRepairDate() != null ? request.getRepairDate() : LocalDateTime.now())
                .build();

        // Extract keywords from symptoms
        repairCase.setSymptomsKeywords(extractKeywords(request.getSymptomsText()));

        // Save repair case
        repairCase = repairCaseRepository.save(repairCase);
        log.info("Repair case created with ID: {}", repairCase.getCaseId());

        // Add parts if provided
        if (request.getParts() != null && !request.getParts().isEmpty()) {
            addPartsToCase(repairCase, request.getParts());
        }

        return mapToResponse(repairCase);
    }

    /**
     * Update existing repair case
     */
    @Transactional
    public RepairCaseResponse updateRepairCase(Long caseId, RepairCaseRequest request) {
        log.info("Updating repair case ID: {}", caseId);

        RepairCase repairCase = repairCaseRepository.findById(caseId)
                .orElseThrow(() -> new IllegalArgumentException("Repair case not found: " + caseId));

        // Update fields
        repairCase.setDeviceType(request.getDeviceType());
        repairCase.setBrand(request.getBrand());
        repairCase.setModel(request.getModel());
        repairCase.setSymptomsText(request.getSymptomsText());
        repairCase.setInspectionNotes(request.getInspectionNotes());
        repairCase.setDiagnosisText(request.getDiagnosisText());
        repairCase.setPredictedFault(request.getPredictedFault());
        repairCase.setFinalFaultCode(request.getFaultCategory());
        repairCase.setSolutionSummary(request.getSolutionSummary());
        repairCase.setRepairStatus(request.getRepairStatus());
        repairCase.setReturnedAfterRepair(request.getReturnedAfterRepair() != null ? request.getReturnedAfterRepair() : false);
        repairCase.setReturnReason(request.getReturnReason());
        repairCase.setRepairDurationMinutes(request.getRepairDurationMinutes());
        repairCase.setTechnicianNotes(request.getTechnicianNotes());

        // Update keywords
        repairCase.setSymptomsKeywords(extractKeywords(request.getSymptomsText()));

        // Update technician if provided
        if (request.getTechnicianId() != null) {
            User technician = userRepository.findById(request.getTechnicianId()).orElse(null);
            repairCase.setTechnician(technician);
        }

        repairCase = repairCaseRepository.save(repairCase);
        log.info("Repair case updated: {}", caseId);

        return mapToResponse(repairCase);
    }

    /**
     * Get repair case by ID
     */
    @Transactional(readOnly = true)
    public RepairCaseResponse getRepairCase(Long caseId) {
        RepairCase repairCase = repairCaseRepository.findById(caseId)
                .orElseThrow(() -> new IllegalArgumentException("Repair case not found: " + caseId));
        return mapToResponse(repairCase);
    }

    /**
     * Get all repair cases with pagination
     */
    @Transactional(readOnly = true)
    public Page<RepairCaseResponse> getAllRepairCases(Pageable pageable) {
        return repairCaseRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    /**
     * Get repair history for a device
     */
    @Transactional(readOnly = true)
    public List<RepairHistorySummary> getRepairHistory(String deviceType, String brand, String model) {
        List<RepairCase> cases = repairCaseRepository.findByDeviceTypeAndBrandAndModelOrderByRepairDateDesc(
                deviceType, brand, model
        );
        return cases.stream()
                .map(this::mapToHistorySummary)
                .collect(Collectors.toList());
    }

    /**
     * Delete repair case
     */
    @Transactional
    public void deleteRepairCase(Long caseId) {
        log.info("Deleting repair case ID: {}", caseId);
        repairCaseRepository.deleteById(caseId);
    }

    /**
     * Add parts to repair case
     */
    @Transactional
    public void addPartsToCase(Long caseId, List<RepairPartRequest> partRequests) {
        RepairCase repairCase = repairCaseRepository.findById(caseId)
                .orElseThrow(() -> new IllegalArgumentException("Repair case not found: " + caseId));
        addPartsToCase(repairCase, partRequests);
    }

    /**
     * Internal method to add parts
     */
    private void addPartsToCase(RepairCase repairCase, List<RepairPartRequest> partRequests) {
        for (RepairPartRequest partRequest : partRequests) {
            InventoryItem inventoryItem = null;
            if (partRequest.getInventoryItemId() != null) {
                inventoryItem = inventoryItemRepository.findById(partRequest.getInventoryItemId()).orElse(null);
            }

            RepairCasePart part = RepairCasePart.builder()
                    .repairCase(repairCase)
                    .inventoryItem(inventoryItem)
                    .partName(partRequest.getPartName())
                    .quantity(partRequest.getQuantity())
                    .wasReplacement(partRequest.getWasReplacement() != null ? partRequest.getWasReplacement() : true)
                    .build();

            repairCasePartRepository.save(part);
            log.debug("Added part '{}' to case {}", partRequest.getPartName(), repairCase.getCaseId());
        }
    }

    /**
     * Get repair statistics
     */
    @Transactional(readOnly = true)
    public RepairStatistics getRepairStatistics() {
        long totalCases = repairCaseRepository.count();
        long completedCases = repairCaseRepository.countByRepairStatus("COMPLETED");
        long returnedCases = repairCaseRepository.countByReturnedAfterRepair(true);
        
        double returnRate = totalCases > 0 ? (returnedCases * 100.0 / totalCases) : 0.0;
        
        Double avgDuration = repairCaseRepository.findAll().stream()
                .filter(rc -> rc.getRepairDurationMinutes() != null)
                .mapToInt(RepairCase::getRepairDurationMinutes)
                .average()
                .orElse(0.0);

        long totalParts = repairCasePartRepository.count();

        return RepairStatistics.builder()
                .totalCases(totalCases)
                .completedCases(completedCases)
                .returnedCases(returnedCases)
                .returnRate(returnRate)
                .averageRepairDuration(avgDuration)
                .totalPartsReplaced(totalParts)
                .build();
    }

    /**
     * Extract keywords from text for indexing
     */
    private String extractKeywords(String text) {
        if (text == null || text.isBlank()) {
            return "";
        }
        
        // Simple keyword extraction: remove common words and extract significant terms
        String[] words = text.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", " ")
                .split("\\s+");
        
        // Filter out common words (simple stopword removal)
        List<String> keywords = List.of(words).stream()
                .filter(word -> word.length() > 3)
                .filter(word -> !isStopWord(word))
                .distinct()
                .collect(Collectors.toList());
        
        return String.join(" ", keywords);
    }

    /**
     * Check if word is a common stopword
     */
    private boolean isStopWord(String word) {
        List<String> stopWords = List.of(
                "the", "and", "for", "with", "this", "that", "from", "have", "been",
                "will", "would", "could", "should", "about", "after", "before"
        );
        return stopWords.contains(word);
    }

    /**
     * Map entity to response DTO
     */
    private RepairCaseResponse mapToResponse(RepairCase repairCase) {
        List<RepairPartResponse> parts = repairCase.getParts().stream()
                .map(this::mapPartToResponse)
                .collect(Collectors.toList());

        return RepairCaseResponse.builder()
                .caseId(repairCase.getCaseId())
                .repairTicketId(repairCase.getRepairTicket() != null ? repairCase.getRepairTicket().getId() : null)
                .deviceType(repairCase.getDeviceType())
                .brand(repairCase.getBrand())
                .model(repairCase.getModel())
                .symptomsText(repairCase.getSymptomsText())
                .inspectionNotes(repairCase.getInspectionNotes())
                .diagnosisText(repairCase.getDiagnosisText())
                .predictedFault(repairCase.getPredictedFault())
                .faultCategory(repairCase.getFinalFaultCode())
                .solutionSummary(repairCase.getSolutionSummary())
                .repairStatus(repairCase.getRepairStatus())
                .returnedAfterRepair(repairCase.isReturnedAfterRepair())
                .returnReason(repairCase.getReturnReason())
                .repairDurationMinutes(repairCase.getRepairDurationMinutes())
                .technicianNotes(repairCase.getTechnicianNotes())
                .technicianName(repairCase.getTechnician() != null ? repairCase.getTechnician().getFullName() : null)
                .repairDate(repairCase.getRepairDate())
                .createdAt(repairCase.getCreatedAt())
                .updatedAt(repairCase.getUpdatedAt())
                .parts(parts)
                .build();
    }

    /**
     * Map part entity to response DTO
     */
    private RepairPartResponse mapPartToResponse(RepairCasePart part) {
        return RepairPartResponse.builder()
                .id(part.getId())
                .inventoryItemId(part.getInventoryItem() != null ? part.getInventoryItem().getId() : null)
                .partName(part.getPartName())
                .quantity(part.getQuantity())
                .wasReplacement(part.isWasReplacement())
                .createdAt(part.getCreatedAt())
                .build();
    }

    /**
     * Map entity to history summary DTO
     */
    private RepairHistorySummary mapToHistorySummary(RepairCase repairCase) {
        return RepairHistorySummary.builder()
                .caseId(repairCase.getCaseId())
                .deviceType(repairCase.getDeviceType())
                .brand(repairCase.getBrand())
                .model(repairCase.getModel())
                .symptomsText(repairCase.getSymptomsText())
                .faultCategory(repairCase.getFinalFaultCode())
                .repairStatus(repairCase.getRepairStatus())
                .returnedAfterRepair(repairCase.isReturnedAfterRepair())
                .repairDurationMinutes(repairCase.getRepairDurationMinutes())
                .technicianName(repairCase.getTechnician() != null ? repairCase.getTechnician().getFullName() : null)
                .repairDate(repairCase.getRepairDate())
                .build();
    }
}
