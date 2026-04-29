package com.aidevice.smartfix.service;

import com.aidevice.smartfix.dto.InventoryDtos;
import com.aidevice.smartfix.model.InventoryItem;
import com.aidevice.smartfix.repository.InventoryItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.math.BigDecimal;

@Service
public class InventoryService {
    private final InventoryItemRepository inventoryRepository;

    public InventoryService(InventoryItemRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    public List<InventoryItem> getAll() {
        return inventoryRepository.findAll();
    }

    @Transactional
    public InventoryItem create(InventoryDtos.InventoryItemRequest request) {
        InventoryItem item = new InventoryItem();
        item.setName(request.name());
        item.setCategory(request.category());
        item.setQuantity(request.quantity() == null ? 0 : request.quantity());
        item.setReorderPoint(request.reorderPoint() == null ? 10 : request.reorderPoint());
        item.setPrice(request.price());
        item.setPurchaseCost(request.purchaseCost() == null ? BigDecimal.ZERO : request.purchaseCost());
        // UI no longer collects supplier; store empty string if null
        item.setSupplier(request.supplier() == null ? "" : request.supplier());
        item.setSku(generateSku(request.category()));
        // Allow explicitly provided stock entry date (date-only string)
        if (request.lastStockedAt() != null && !request.lastStockedAt().isBlank()) {
            try {
                LocalDate date = LocalDate.parse(request.lastStockedAt());
                item.setLastStockedAt(date.atStartOfDay());
            } catch (Exception e) {
                item.setLastStockedAt(LocalDateTime.now());
            }
        } else {
            item.setLastStockedAt(LocalDateTime.now());
        }
        return inventoryRepository.save(item);
    }

    @Transactional
    public InventoryItem update(Long id, InventoryDtos.InventoryItemRequest request) {
        InventoryItem item = inventoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Inventory item not found"));
        int oldQuantity = item.getQuantity() == null ? 0 : item.getQuantity();
        item.setName(request.name());
        item.setCategory(request.category());
        item.setQuantity(request.quantity());
        item.setReorderPoint(request.reorderPoint());
        item.setPrice(request.price());
        item.setPurchaseCost(request.purchaseCost() == null ? item.getPurchaseCost() : request.purchaseCost());
        // Supplier is optional now
        if (request.supplier() != null) {
            item.setSupplier(request.supplier());
        }
        // Update lastStockedAt when an explicit date is provided or when quantity increased
        if (request.lastStockedAt() != null && !request.lastStockedAt().isBlank()) {
            try {
                LocalDate date = LocalDate.parse(request.lastStockedAt());
                item.setLastStockedAt(date.atStartOfDay());
            } catch (Exception e) {
                item.setLastStockedAt(LocalDateTime.now());
            }
        } else if (request.quantity() != null && request.quantity() > oldQuantity) {
            item.setLastStockedAt(LocalDateTime.now());
        }
        return inventoryRepository.save(item);
    }

    @Transactional
    public void delete(Long id) {
        inventoryRepository.deleteById(id);
    }

    private String generateSku(String category) {
        String base = (category == null || category.isBlank()) ? "GEN" : category.substring(0, Math.min(3, category.length())).toUpperCase();
        long next = inventoryRepository.count() + 1;
        return base + "-" + next;
    }
}
