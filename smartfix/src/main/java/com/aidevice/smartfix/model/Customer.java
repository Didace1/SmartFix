package com.aidevice.smartfix.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "customers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(unique = true)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(columnDefinition = "TEXT")
    private String address;

    private String nationalId;

    @Column(nullable = false)
    private String customerType; // INDIVIDUAL, BUSINESS

    @Column(nullable = false, columnDefinition = "int default 0")
    private Integer loyaltyPoints;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (loyaltyPoints == null) loyaltyPoints = 0;
        if (customerType == null) customerType = "INDIVIDUAL";
    }
}
