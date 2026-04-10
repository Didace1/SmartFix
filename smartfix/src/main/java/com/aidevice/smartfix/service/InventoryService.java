package com.aidevice.smartfix.service;

import com.aidevice.smartfix.dto.InventoryDtos;
import com.aidevice.smartfix.model.InventoryItem;
import com.aidevice.smartfix.repository.InventoryItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
        item.setSupplier(request.supplier());
        item.setSku(generateSku(request.category()));
        return inventoryRepository.save(item);
    }

    @Transactional
    public InventoryItem update(Long id, InventoryDtos.InventoryItemRequest request) {
        InventoryItem item = inventoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Inventory item not found"));
        item.setName(request.name());
        item.setCategory(request.category());
        item.setQuantity(request.quantity());
        item.setReorderPoint(request.reorderPoint());
        item.setPrice(request.price());
        item.setSupplier(request.supplier());
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
