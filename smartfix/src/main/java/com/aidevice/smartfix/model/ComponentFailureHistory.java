package com.aidevice.smartfix.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entity representing historical component failure data.
 * Used for predictive analysis and component failure patterns.
 */
@Entity
@Table(
    name = "component_failure_history",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_component_failure",
        columnNames = {"device_type", "brand", "model", "component_name"}
    ),
    indexes = {
        @Index(name = "idx_component_failure_device", columnList = "device_type,brand,model"),
        @Index(name = "idx_component_failure_component", columnList = "component_name"),
        @Index(name = "idx_component_failure_date", columnList = "last_failure_date")
    }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComponentFailureHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "device_type", nullable = false, length = 100)
    private String deviceType;

    @Column(length = 100)
    private String brand;

    @Column(length = 200)
    private String model;

    @Column(name = "component_name", nullable = false, length = 255)
    private String componentName;

    @Column(name = "failure_count", nullable = false)
    @Builder.Default
    private Integer failureCount = 1;

    @Column(name = "replacement_count", nullable = false)
    @Builder.Default
    private Integer replacementCount = 0;

    @Column(name = "last_failure_date", nullable = false)
    private LocalDateTime lastFailureDate;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = now;
        if (lastFailureDate == null) lastFailureDate = now;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * Calculate failure rate as percentage
     */
    public double getFailureRate() {
        if (failureCount == 0) return 0.0;
        return (replacementCount.doubleValue() / failureCount.doubleValue()) * 100.0;
    }
}
