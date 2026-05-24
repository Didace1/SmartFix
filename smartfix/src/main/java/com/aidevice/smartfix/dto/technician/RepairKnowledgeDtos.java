package com.aidevice.smartfix.dto.technician;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTOs for Module 1: Repair Knowledge Management
 */
public class RepairKnowledgeDtos {

    /**
     * Request DTO for creating/updating repair cases
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RepairCaseRequest {
        
        @NotNull(message = "Repair ticket ID is required")
        private Long repairTicketId;
        
        @NotBlank(message = "Device type is required")
        @Size(max = 100)
        private String deviceType;
        
        @Size(max = 100)
        private String brand;
        
        @Size(max = 200)
        private String model;
        
        @Size(max = 100)
        private String serialNumber;
        
        @NotBlank(message = "Symptoms description is required")
        private String symptomsText;
        
        private String inspectionNotes;
        
        private String diagnosticObservations;
        
        private String diagnosisText;
        
        private String predictedFault;
        
        @Size(max = 100)
        private String faultCategory;
        
        private String repairSolution;
        
        private String repairProcedure;
        
        private String solutionSummary;
        
        @NotBlank(message = "Repair status is required")
        private String repairStatus;
        
        @Builder.Default
        private Boolean returnedAfterRepair = false;
        
        private String returnReason;
        
        @Min(0)
        private Integer repairDurationMinutes;
        
        private String technicianNotes;
        
        private Long technicianId;
        
        private LocalDateTime repairDate;
        
        private List<RepairPartRequest> parts;
    }

    /**
     * Request DTO for repair parts
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RepairPartRequest {
        
        private Long inventoryItemId;
        
        @NotBlank(message = "Part name is required")
        private String partName;
        
        private String partType;
        
        @Min(1)
        @Builder.Default
        private Integer quantity = 1;
        
        @Builder.Default
        private Boolean wasReplacement = true;
        
        private String replacementReason;
        
        private String componentCondition;
    }

    /**
     * Response DTO for repair cases
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RepairCaseResponse {
        
        private Long caseId;
        private Long repairTicketId;
        private String deviceType;
        private String brand;
        private String model;
        private String serialNumber;
        private String symptomsText;
        private String inspectionNotes;
        private String diagnosticObservations;
        private String diagnosisText;
        private String predictedFault;
        private String faultCategory;
        private String repairSolution;
        private String repairProcedure;
        private String solutionSummary;
        private String repairStatus;
        private Boolean returnedAfterRepair;
        private String returnReason;
        private Integer repairDurationMinutes;
        private String technicianNotes;
        private String technicianName;
        private LocalDateTime repairDate;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private List<RepairPartResponse> parts;
    }

    /**
     * Response DTO for repair parts
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RepairPartResponse {
        
        private Long id;
        private Long inventoryItemId;
        private String partName;
        private String partType;
        private Integer quantity;
        private Boolean wasReplacement;
        private String replacementReason;
        private String componentCondition;
        private LocalDateTime createdAt;
    }

    /**
     * DTO for repair history summary
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RepairHistorySummary {
        
        private Long caseId;
        private String deviceType;
        private String brand;
        private String model;
        private String symptomsText;
        private String faultCategory;
        private String repairStatus;
        private Boolean returnedAfterRepair;
        private Integer repairDurationMinutes;
        private String technicianName;
        private LocalDateTime repairDate;
    }

    /**
     * DTO for repair statistics
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RepairStatistics {
        
        private Long totalCases;
        private Long completedCases;
        private Long returnedCases;
        private Double returnRate;
        private Double averageRepairDuration;
        private Long totalPartsReplaced;
        private List<FaultCategoryStats> faultCategoryDistribution;
        private List<ComponentStats> topFailingComponents;
    }

    /**
     * DTO for fault category statistics
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FaultCategoryStats {
        
        private String category;
        private Long count;
        private Double percentage;
    }

    /**
     * DTO for component statistics
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ComponentStats {
        
        private String componentName;
        private Long failureCount;
        private Long replacementCount;
        private Double replacementRate;
    }
}
