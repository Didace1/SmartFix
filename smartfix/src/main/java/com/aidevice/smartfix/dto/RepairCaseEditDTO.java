package com.aidevice.smartfix.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for editing/correcting repair cases
 * Allows admins to fix technician mistakes
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RepairCaseEditDTO {
    
    private Long caseId;
    
    // Editable fields
    private String deviceType;
    private String brand;
    private String model;
    private String symptomsText;
    private String diagnosisText;
    private String solutionSummary;
    private String repairStatus; // SUCCESS, FAILED, PARTIAL
    private Boolean returnedAfterRepair;
    private Integer repairDurationMinutes;
    private String technicianNotes;
    
    // Edit metadata
    private Long editedByAdminId;
    private String editReason;
}
