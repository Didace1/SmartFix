package com.aidevice.smartfix.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity representing statistical patterns in repair cases.
 * Used for pattern detection and repair trend analysis.
 */
@Entity
@Table(
    name = "repair_pattern_statistics",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_repair_pattern",
        columnNames = {"device_type", "brand", "symptom_pattern"}
    ),
    indexes = {
        @Index(name = "idx_repair_pattern_device", columnList = "device_type,brand"),
        @Index(name = "idx_repair_pattern_fault", columnList = "fault_category")
    }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RepairPatternStatistics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "device_type", nullable = false, length = 100)
    private String deviceType;

    @Column(length = 100)
    private String brand;

    @Column(name = "symptom_pattern", nullable = false, columnDefinition = "TEXT")
    private String symptomPattern;

    @Column(name = "fault_category", length = 100)
    private String faultCategory;

    @Column(name = "common_solution", columnDefinition = "TEXT")
    private String commonSolution;

    @Column(name = "occurrence_count", nullable = false)
    @Builder.Default
    private Integer occurrenceCount = 1;

    @Column(name = "success_rate", precision = 5, scale = 2)
    private BigDecimal successRate;

    @Column(name = "return_rate", precision = 5, scale = 2)
    private BigDecimal returnRate;

    @Column(name = "average_repair_duration")
    private Integer averageRepairDuration;

    @Column(name = "last_occurrence", nullable = false)
    private LocalDateTime lastOccurrence;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = now;
        if (lastOccurrence == null) lastOccurrence = now;
        if (occurrenceCount == null) occurrenceCount = 1;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * Check if this pattern has high return rate (>20%)
     */
    public boolean hasHighReturnRate() {
        return returnRate != null && returnRate.compareTo(new BigDecimal("20.00")) > 0;
    }

    /**
     * Check if this pattern has high success rate (>80%)
     */
    public boolean hasHighSuccessRate() {
        return successRate != null && successRate.compareTo(new BigDecimal("80.00")) > 0;
    }

    /**
     * Get confidence level based on occurrence count
     */
    public String getConfidenceLevel() {
        if (occurrenceCount >= 50) return "HIGH";
        if (occurrenceCount >= 20) return "MEDIUM";
        if (occurrenceCount >= 5) return "LOW";
        return "VERY_LOW";
    }
}
