package com.aidevice.smartfix.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Integer reorderPoint;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    // Purchase cost per unit (kept hidden from sales UI)
    @Column(precision = 10, scale = 2)
    private BigDecimal purchaseCost;

    @Column
    private String supplier;

    @Column(unique = true)
    private String sku;

    @Column
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime lastStockedAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (lastStockedAt == null) lastStockedAt = LocalDateTime.now();
        if (purchaseCost == null) purchaseCost = BigDecimal.ZERO;
    }
}
