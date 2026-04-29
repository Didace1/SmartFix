package com.aidevice.smartfix.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "diagnoses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Diagnosis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "device_id")
    private Device device;

    @ManyToOne
    @JoinColumn(name = "technician_id")
    private User technician;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String symptomsText;

    @Column(columnDefinition = "TEXT")
    private String symptomsChecklist;

    @Column(columnDefinition = "TEXT")
    private String imagePaths;

    @Column(nullable = false)
    private String aiResult;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal confidenceScore;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean technicianConfirmed;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}
