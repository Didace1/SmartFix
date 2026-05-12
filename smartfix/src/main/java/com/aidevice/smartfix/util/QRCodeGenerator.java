package com.aidevice.smartfix.util;

import com.aidevice.smartfix.model.InventoryItem;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Component
public class QRCodeGenerator {
    
    private static final int QR_CODE_WIDTH = 300;
    private static final int QR_CODE_HEIGHT = 300;
    private static final String QR_CODE_IMAGE_FORMAT = "PNG";
    
    /**
     * Generate QR code content as JSON
     */
    public String generateQRCodeContent(InventoryItem inventoryItem, String qrCodeValue) {
        try {
            Map<String, Object> qrContent = new HashMap<>();
            qrContent.put("itemId", inventoryItem.getId());
            qrContent.put("code", qrCodeValue);
            qrContent.put("name", inventoryItem.getName());
            qrContent.put("brand", inventoryItem.getBrand());
            qrContent.put("model", inventoryItem.getModel());
            qrContent.put("category", inventoryItem.getCategory() != null ? inventoryItem.getCategory().getName() : "Unknown");
            qrContent.put("price", inventoryItem.getPrice());
            qrContent.put("timestamp", System.currentTimeMillis());
            
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.writeValueAsString(qrContent);
        } catch (Exception e) {
            // Fallback to simple format
            return String.format("{\"itemId\":%d,\"code\":\"%s\",\"name\":\"%s\"}", 
                inventoryItem.getId(), qrCodeValue, inventoryItem.getName());
        }
    }
    
    /**
     * Generate QR code as Base64 string
     */
    public String generateQRCodeBase64(String qrCodeContent) throws WriterException, IOException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        
        Map<EncodeHintType, Object> hints = new HashMap<>();
        hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.M);
        hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
        hints.put(EncodeHintType.MARGIN, 1);
        
        BitMatrix bitMatrix = qrCodeWriter.encode(qrCodeContent, BarcodeFormat.QR_CODE, 
            QR_CODE_WIDTH, QR_CODE_HEIGHT, hints);
        
        BufferedImage qrImage = MatrixToImageWriter.toBufferedImage(bitMatrix);
        
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(qrImage, QR_CODE_IMAGE_FORMAT, baos);
        byte[] imageBytes = baos.toByteArray();
        
        return Base64.getEncoder().encodeToString(imageBytes);
    }
    
    /**
     * Generate QR code and save to file
     */
    public String generateQRCodeImage(String qrCodeContent, String fileName) throws WriterException, IOException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        
        Map<EncodeHintType, Object> hints = new HashMap<>();
        hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.M);
        hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
        hints.put(EncodeHintType.MARGIN, 1);
        
        BitMatrix bitMatrix = qrCodeWriter.encode(qrCodeContent, BarcodeFormat.QR_CODE, 
            QR_CODE_WIDTH, QR_CODE_HEIGHT, hints);
        
        // Create qr-codes directory if it doesn't exist
        String qrCodesDir = "qr-codes";
        Path qrCodesPath = FileSystems.getDefault().getPath(qrCodesDir);
        if (!qrCodesPath.toFile().exists()) {
            qrCodesPath.toFile().mkdirs();
        }
        
        Path path = FileSystems.getDefault().getPath(qrCodesDir, fileName + ".png");
        MatrixToImageWriter.writeToPath(bitMatrix, QR_CODE_IMAGE_FORMAT, path);
        
        return path.toString();
    }
    
    /**
     * Generate QR code value in SmartFix format
     */
    public String generateQRCodeValue(InventoryItem inventoryItem) {
        // Format: SFQR + CategoryCode(2) + ItemId(4) + Random(4)
        String categoryCode = inventoryItem.getCategory() != null ? 
            inventoryItem.getCategory().getName().substring(0, Math.min(2, inventoryItem.getCategory().getName().length())).toUpperCase() : 
            "GN"; // General
        
        String itemIdPart = String.format("%04d", inventoryItem.getId() % 10000);
        String randomPart = String.format("%04d", (int)(Math.random() * 10000));
        
        return "SFQR" + categoryCode + itemIdPart + randomPart;
    }
    
    /**
     * Create complete QR code with image
     */
    public QRCodeResult createCompleteQRCode(InventoryItem inventoryItem, String qrCodeValue) {
        try {
            String qrContent = generateQRCodeContent(inventoryItem, qrCodeValue);
            String base64Image = generateQRCodeBase64(qrContent);
            String imagePath = generateQRCodeImage(qrContent, qrCodeValue);
            
            return new QRCodeResult(qrCodeValue, qrContent, base64Image, imagePath, true, null);
        } catch (Exception e) {
            return new QRCodeResult(qrCodeValue, null, null, null, false, e.getMessage());
        }
    }
    
    /**
     * QR Code generation result
     */
    public static class QRCodeResult {
        private final String qrCodeValue;
        private final String qrContent;
        private final String base64Image;
        private final String imagePath;
        private final boolean success;
        private final String errorMessage;
        
        public QRCodeResult(String qrCodeValue, String qrContent, String base64Image, 
                           String imagePath, boolean success, String errorMessage) {
            this.qrCodeValue = qrCodeValue;
            this.qrContent = qrContent;
            this.base64Image = base64Image;
            this.imagePath = imagePath;
            this.success = success;
            this.errorMessage = errorMessage;
        }
        
        // Getters
        public String getQrCodeValue() { return qrCodeValue; }
        public String getQrContent() { return qrContent; }
        public String getBase64Image() { return base64Image; }
        public String getImagePath() { return imagePath; }
        public boolean isSuccess() { return success; }
        public String getErrorMessage() { return errorMessage; }
    }
}