package com.aidevice.smartfix.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for capturing repair completion information
 * Dual purpose: Performance tracking + AI learning
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RepairCompletionDTO {
    
    // Required fields (10 seconds to complete)
    private Long repairTaskId;
    private String repairResult; // SUCCESS, FAILED, PARTIAL
    private String solutionSummary; // What did you do? (1 sentence)
    private Boolean customerSatisfied; // true/false
    
    // Optional fields (for bonus points/gamification)
    private String detailedNotes;
    private String tipsForNextTime;
}
