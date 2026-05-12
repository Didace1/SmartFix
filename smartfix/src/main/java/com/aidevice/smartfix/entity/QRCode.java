package com.aidevice.smartfix.entity;

import com.aidevice.smartfix.model.InventoryItem;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "qr_codes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QRCode {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "qr_code_value", unique = true, nullable = false)
    private String qrCodeValue;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_item_id", nullable = false)
    private InventoryItem inventoryItem;
    
    @Column(name = "qr_image_path")
    private String qrImagePath;
    
    @Column(name = "qr_image_base64", columnDefinition = "TEXT")
    private String qrImageBase64;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    @Column(name = "scan_count", nullable = false)
    private Integer scanCount = 0;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "last_scanned_at")
    private LocalDateTime lastScannedAt;
    
    public QRCode(String qrCodeValue, InventoryItem inventoryItem) {
        this.qrCodeValue = qrCodeValue;
        this.inventoryItem = inventoryItem;
        this.isActive = true;
        this.scanCount = 0;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public void incrementScanCount() {
        this.scanCount++;
        this.lastScannedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}