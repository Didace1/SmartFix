package com.aidevice.smartfix.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "components")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeviceComponent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "device_id")
    private Device device;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal healthScore;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal failureProbability;

    private Integer predictedLifeDays;

    @Column(nullable = false)
    private LocalDate lastAssessed;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean alertSent;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (lastAssessed == null) lastAssessed = LocalDate.now();
    }
}
