package com.aidevice.smartfix.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "repair_tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RepairTask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String customerRef;

    private String deviceType;
    private String deviceModel;

    @Column(columnDefinition = "TEXT")
    private String repairNote;

    @ManyToOne
    @JoinColumn(name = "technician_id")
    private User assignedTechnician;

    @Column(nullable = false)
    private String status; // PENDING, ASSIGNED, IN_PROGRESS, COMPLETED

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime assignedAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (status == null) status = "PENDING";
    }
}
