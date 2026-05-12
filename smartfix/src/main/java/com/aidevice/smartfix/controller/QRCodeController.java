package com.aidevice.smartfix.controller;

import com.aidevice.smartfix.entity.QRCode;
import com.aidevice.smartfix.model.InventoryItem;
import com.aidevice.smartfix.service.QRCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/qrcodes")
@CrossOrigin(origins = "*")
public class QRCodeController {
    
    @Autowired
    private QRCodeService qrCodeService;
    
    /**
     * Get all QR codes
     */
    @GetMapping
    public ResponseEntity<List<QRCode>> getAllQRCodes() {
        try {
            List<QRCode> qrCodes = qrCodeService.getAllQRCodes();
            return ResponseEntity.ok(qrCodes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Scan QR code and get product information
     */
    @PostMapping("/scan")
    public ResponseEntity<Map<String, Object>> scanQRCode(@RequestBody Map<String, String> request) {
        try {
            String qrCodeData = request.get("qrCodeData");
            
            if (qrCodeData == null || qrCodeData.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "QR code data is required");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            Optional<InventoryItem> itemOpt = qrCodeService.scanQRCode(qrCodeData.trim());
            
            Map<String, Object> response = new HashMap<>();
            
            if (itemOpt.isPresent()) {
                InventoryItem item = itemOpt.get();
                
                response.put("success", true);
                response.put("found", true);
                response.put("product", createProductResponse(item));
                response.put("message", "Product found successfully");
            } else {
                response.put("success", true);
                response.put("found", false);
                response.put("message", "Product not found for QR code");
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error scanning QR code: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Generate QR code for inventory item
     */
    @PostMapping("/generate/{inventoryItemId}")
    public ResponseEntity<Map<String, Object>> generateQRCode(@PathVariable Long inventoryItemId) {
        try {
            QRCode qrCode = qrCodeService.regenerateQRCodeForItem(inventoryItemId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("qrCode", createQRCodeResponse(qrCode));
            response.put("message", "QR code generated successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error generating QR code: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Get QR code for specific inventory item
     */
    @GetMapping("/item/{inventoryItemId}")
    public ResponseEntity<Map<String, Object>> getQRCodeForItem(@PathVariable Long inventoryItemId) {
        try {
            Optional<QRCode> qrCodeOpt = qrCodeService.getQRCodeForItem(inventoryItemId);
            
            Map<String, Object> response = new HashMap<>();
            
            if (qrCodeOpt.isPresent()) {
                response.put("success", true);
                response.put("qrCode", createQRCodeResponse(qrCodeOpt.get()));
            } else {
                response.put("success", false);
                response.put("message", "No QR code found for inventory item");
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error retrieving QR code: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Search QR codes
     */
    @GetMapping("/search")
    public ResponseEntity<List<QRCode>> searchQRCodes(@RequestParam String query) {
        try {
            List<QRCode> qrCodes = qrCodeService.searchQRCodes(query);
            return ResponseEntity.ok(qrCodes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get QR code statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<QRCodeService.QRCodeStats> getQRCodeStatistics() {
        try {
            QRCodeService.QRCodeStats stats = qrCodeService.getQRCodeStatistics();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Update QR code
     */
    @PutMapping("/{qrCodeId}")
    public ResponseEntity<Map<String, Object>> updateQRCode(
            @PathVariable Long qrCodeId, 
            @RequestBody QRCode updatedQRCode) {
        try {
            QRCode qrCode = qrCodeService.updateQRCode(qrCodeId, updatedQRCode);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("qrCode", createQRCodeResponse(qrCode));
            response.put("message", "QR code updated successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error updating QR code: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Delete QR code
     */
    @DeleteMapping("/{qrCodeId}")
    public ResponseEntity<Map<String, Object>> deleteQRCode(@PathVariable Long qrCodeId) {
        try {
            qrCodeService.deleteQRCode(qrCodeId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "QR code deleted successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error deleting QR code: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Generate bulk QR codes
     */
    @PostMapping("/generate-bulk")
    public ResponseEntity<Map<String, Object>> generateBulkQRCodes() {
        try {
            List<QRCode> qrCodes = qrCodeService.generateBulkQRCodes();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("generated", qrCodes.size());
            response.put("qrCodes", qrCodes.stream().map(this::createQRCodeResponse).toList());
            response.put("message", "Bulk QR codes generated successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error generating bulk QR codes: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    /**
     * Helper method to create product response
     */
    private Map<String, Object> createProductResponse(InventoryItem item) {
        Map<String, Object> product = new HashMap<>();
        product.put("id", item.getId());
        product.put("name", item.getName());
        product.put("description", item.getDescription());
        product.put("price", item.getPrice());
        product.put("quantity", item.getQuantity());
        product.put("reorderPoint", item.getReorderPoint());
        product.put("brand", item.getBrand());
        product.put("model", item.getModel());
        product.put("category", item.getCategory() != null ? item.getCategory().getName() : null);
        product.put("categoryId", item.getCategory() != null ? item.getCategory().getId() : null);
        product.put("createdAt", item.getCreatedAt());
        product.put("updatedAt", item.getUpdatedAt());
        
        // Add stock status
        if (item.getQuantity() <= 0) {
            product.put("stockStatus", "OUT_OF_STOCK");
        } else if (item.getQuantity() <= item.getReorderPoint()) {
            product.put("stockStatus", "LOW_STOCK");
        } else {
            product.put("stockStatus", "IN_STOCK");
        }
        
        return product;
    }
    
    /**
     * Helper method to create QR code response
     */
    private Map<String, Object> createQRCodeResponse(QRCode qrCode) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", qrCode.getId());
        response.put("qrCodeValue", qrCode.getQrCodeValue());
        response.put("qrImageBase64", qrCode.getQrImageBase64());
        response.put("qrImagePath", qrCode.getQrImagePath());
        response.put("isActive", qrCode.getIsActive());
        response.put("scanCount", qrCode.getScanCount());
        response.put("createdAt", qrCode.getCreatedAt());
        response.put("updatedAt", qrCode.getUpdatedAt());
        response.put("lastScannedAt", qrCode.getLastScannedAt());
        
        if (qrCode.getInventoryItem() != null) {
            response.put("inventoryItem", createProductResponse(qrCode.getInventoryItem()));
        }
        
        return response;
    }
}