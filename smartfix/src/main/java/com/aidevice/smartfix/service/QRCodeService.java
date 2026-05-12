package com.aidevice.smartfix.service;

import com.aidevice.smartfix.entity.QRCode;
import com.aidevice.smartfix.model.InventoryItem;
import com.aidevice.smartfix.repository.QRCodeRepository;
import com.aidevice.smartfix.repository.InventoryItemRepository;
import com.aidevice.smartfix.util.QRCodeGenerator;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class QRCodeService {
    
    @Autowired
    private QRCodeRepository qrCodeRepository;
    
    @Autowired
    private InventoryItemRepository inventoryItemRepository;
    
    @Autowired
    private QRCodeGenerator qrCodeGenerator;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    /**
     * Generate a unique QR code for an inventory item
     */
    public String generateUniqueQRCode(InventoryItem inventoryItem) {
        String qrCode;
        int attempts = 0;
        final int maxAttempts = 100;
        
        do {
            qrCode = qrCodeGenerator.generateQRCodeValue(inventoryItem);
            attempts++;
            
            if (attempts > maxAttempts) {
                throw new RuntimeException("Unable to generate unique QR code after " + maxAttempts + " attempts");
            }
        } while (qrCodeRepository.existsByQrCodeValue(qrCode));
        
        return qrCode;
    }
    
    /**
     * Create and save QR code for inventory item
     */
    public QRCode createQRCodeForItem(InventoryItem inventoryItem) {
        // Check if QR code already exists for this item
        Optional<QRCode> existingQRCode = qrCodeRepository.findByInventoryItem(inventoryItem);
        if (existingQRCode.isPresent()) {
            return existingQRCode.get();
        }
        
        String qrCodeValue = generateUniqueQRCode(inventoryItem);
        QRCodeGenerator.QRCodeResult result = qrCodeGenerator.createCompleteQRCode(inventoryItem, qrCodeValue);
        
        if (!result.isSuccess()) {
            throw new RuntimeException("Failed to generate QR code: " + result.getErrorMessage());
        }
        
        QRCode qrCode = new QRCode(qrCodeValue, inventoryItem);
        qrCode.setQrImageBase64(result.getBase64Image());
        qrCode.setQrImagePath(result.getImagePath());
        
        return qrCodeRepository.save(qrCode);
    }
    
    /**
     * Find QR code by value
     */
    public Optional<QRCode> findByQRCodeValue(String qrCodeValue) {
        return qrCodeRepository.findByQrCodeValue(qrCodeValue);
    }
    
    /**
     * Scan QR code and return product information
     */
    public Optional<InventoryItem> scanQRCode(String qrCodeData) {
        try {
            // Try to parse as JSON first (new format)
            JsonNode jsonNode = objectMapper.readTree(qrCodeData);
            
            if (jsonNode.has("itemId")) {
                // New JSON format
                Long itemId = jsonNode.get("itemId").asLong();
                return inventoryItemRepository.findById(itemId);
            } else if (jsonNode.has("code")) {
                // JSON format with code
                String qrCodeValue = jsonNode.get("code").asText();
                return scanByQRCodeValue(qrCodeValue);
            }
        } catch (Exception e) {
            // Not JSON, try as direct QR code value
            return scanByQRCodeValue(qrCodeData);
        }
        
        return Optional.empty();
    }
    
    /**
     * Scan by QR code value
     */
    private Optional<InventoryItem> scanByQRCodeValue(String qrCodeValue) {
        Optional<QRCode> qrCodeOpt = qrCodeRepository.findByQrCodeValue(qrCodeValue);
        
        if (qrCodeOpt.isPresent()) {
            QRCode qrCode = qrCodeOpt.get();
            
            // Update scan statistics
            qrCode.incrementScanCount();
            qrCodeRepository.save(qrCode);
            
            // Return the associated inventory item
            return Optional.of(qrCode.getInventoryItem());
        }
        
        return Optional.empty();
    }
    
    /**
     * Get all QR codes
     */
    public List<QRCode> getAllQRCodes() {
        return qrCodeRepository.findByIsActiveTrue();
    }
    
    /**
     * Search QR codes
     */
    public List<QRCode> searchQRCodes(String searchTerm) {
        return qrCodeRepository.searchQRCodes(searchTerm);
    }
    
    /**
     * Get QR code for inventory item
     */
    public Optional<QRCode> getQRCodeForItem(Long inventoryItemId) {
        return qrCodeRepository.findByInventoryItemId(inventoryItemId);
    }
    
    /**
     * Update QR code
     */
    public QRCode updateQRCode(Long qrCodeId, QRCode updatedQRCode) {
        Optional<QRCode> existingQRCodeOpt = qrCodeRepository.findById(qrCodeId);
        
        if (existingQRCodeOpt.isPresent()) {
            QRCode existingQRCode = existingQRCodeOpt.get();
            
            if (updatedQRCode.getQrCodeValue() != null) {
                existingQRCode.setQrCodeValue(updatedQRCode.getQrCodeValue());
            }
            if (updatedQRCode.getIsActive() != null) {
                existingQRCode.setIsActive(updatedQRCode.getIsActive());
            }
            
            existingQRCode.setUpdatedAt(LocalDateTime.now());
            
            return qrCodeRepository.save(existingQRCode);
        }
        
        throw new RuntimeException("QR code not found with id: " + qrCodeId);
    }
    
    /**
     * Delete QR code (soft delete)
     */
    public void deleteQRCode(Long qrCodeId) {
        Optional<QRCode> qrCodeOpt = qrCodeRepository.findById(qrCodeId);
        
        if (qrCodeOpt.isPresent()) {
            QRCode qrCode = qrCodeOpt.get();
            qrCode.setIsActive(false);
            qrCode.setUpdatedAt(LocalDateTime.now());
            qrCodeRepository.save(qrCode);
        } else {
            throw new RuntimeException("QR code not found with id: " + qrCodeId);
        }
    }
    
    /**
     * Get QR code statistics
     */
    public QRCodeStats getQRCodeStatistics() {
        List<QRCode> allQRCodes = qrCodeRepository.findByIsActiveTrue();
        List<QRCode> mostScanned = qrCodeRepository.findMostScannedQRCodes();
        
        int totalQRCodes = allQRCodes.size();
        int totalScans = allQRCodes.stream().mapToInt(QRCode::getScanCount).sum();
        
        return new QRCodeStats(totalQRCodes, totalScans, mostScanned);
    }
    
    /**
     * Regenerate QR code for item
     */
    public QRCode regenerateQRCodeForItem(Long inventoryItemId) {
        Optional<InventoryItem> itemOpt = inventoryItemRepository.findById(inventoryItemId);
        
        if (itemOpt.isPresent()) {
            InventoryItem item = itemOpt.get();
            
            // Deactivate existing QR code
            Optional<QRCode> existingQRCodeOpt = qrCodeRepository.findByInventoryItem(item);
            if (existingQRCodeOpt.isPresent()) {
                QRCode existingQRCode = existingQRCodeOpt.get();
                existingQRCode.setIsActive(false);
                qrCodeRepository.save(existingQRCode);
            }
            
            // Create new QR code
            return createQRCodeForItem(item);
        }
        
        throw new RuntimeException("Inventory item not found with id: " + inventoryItemId);
    }
    
    /**
     * Generate bulk QR codes for all inventory items without QR codes
     */
    public List<QRCode> generateBulkQRCodes() {
        List<InventoryItem> itemsWithoutQRCodes = inventoryItemRepository.findAll()
            .stream()
            .filter(item -> qrCodeRepository.findByInventoryItem(item).isEmpty())
            .toList();
        
        return itemsWithoutQRCodes.stream()
            .map(this::createQRCodeForItem)
            .toList();
    }
    
    /**
     * QR code statistics inner class
     */
    public static class QRCodeStats {
        private final int totalQRCodes;
        private final int totalScans;
        private final List<QRCode> mostScannedQRCodes;
        
        public QRCodeStats(int totalQRCodes, int totalScans, List<QRCode> mostScannedQRCodes) {
            this.totalQRCodes = totalQRCodes;
            this.totalScans = totalScans;
            this.mostScannedQRCodes = mostScannedQRCodes;
        }
        
        public int getTotalQRCodes() { return totalQRCodes; }
        public int getTotalScans() { return totalScans; }
        public List<QRCode> getMostScannedQRCodes() { return mostScannedQRCodes; }
    }
}