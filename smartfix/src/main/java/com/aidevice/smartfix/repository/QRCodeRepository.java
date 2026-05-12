package com.aidevice.smartfix.repository;

import com.aidevice.smartfix.entity.QRCode;
import com.aidevice.smartfix.model.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QRCodeRepository extends JpaRepository<QRCode, Long> {
    
    /**
     * Find QR code by its value
     */
    Optional<QRCode> findByQrCodeValue(String qrCodeValue);
    
    /**
     * Find QR code by inventory item
     */
    Optional<QRCode> findByInventoryItem(InventoryItem inventoryItem);
    
    /**
     * Find QR code by inventory item ID
     */
    Optional<QRCode> findByInventoryItemId(Long inventoryItemId);
    
    /**
     * Check if QR code value exists
     */
    boolean existsByQrCodeValue(String qrCodeValue);
    
    /**
     * Find all active QR codes
     */
    List<QRCode> findByIsActiveTrue();
    
    /**
     * Find QR codes by inventory item name (for search)
     */
    @Query("SELECT q FROM QRCode q WHERE q.inventoryItem.name LIKE %:searchTerm% OR q.qrCodeValue LIKE %:searchTerm%")
    List<QRCode> searchQRCodes(@Param("searchTerm") String searchTerm);
    
    /**
     * Find most scanned QR codes
     */
    @Query("SELECT q FROM QRCode q WHERE q.isActive = true ORDER BY q.scanCount DESC")
    List<QRCode> findMostScannedQRCodes();
    
    /**
     * Count total active QR codes
     */
    long countByIsActiveTrue();
    
    /**
     * Find QR codes by category
     */
    @Query("SELECT q FROM QRCode q WHERE q.inventoryItem.category.id = :categoryId AND q.isActive = true")
    List<QRCode> findByCategoryId(@Param("categoryId") Long categoryId);
}