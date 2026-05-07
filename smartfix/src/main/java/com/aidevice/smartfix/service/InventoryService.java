package com.aidevice.smartfix.service;

import com.aidevice.smartfix.dto.InventoryDtos;
import com.aidevice.smartfix.model.Category;
import com.aidevice.smartfix.model.InventoryItem;
import com.aidevice.smartfix.model.Sale;
import com.aidevice.smartfix.model.SaleItem;
import com.aidevice.smartfix.repository.CategoryRepository;
import com.aidevice.smartfix.repository.InventoryItemRepository;
import com.aidevice.smartfix.repository.SaleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class InventoryService {
    private final InventoryItemRepository inventoryRepository;
    private final CategoryRepository categoryRepository;
    private final SaleRepository saleRepository;

    public InventoryService(
            InventoryItemRepository inventoryRepository,
            CategoryRepository categoryRepository,
            SaleRepository saleRepository
    ) {
        this.inventoryRepository = inventoryRepository;
        this.categoryRepository = categoryRepository;
        this.saleRepository = saleRepository;
    }

    public List<InventoryItem> getAll() {
        return inventoryRepository.findAll();
    }

    public Map<String, Object> getAnalytics(int periodDays) {
        List<InventoryItem> items = inventoryRepository.findAll();
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(Math.max(1, periodDays) - 1L);
        List<Sale> salesInRange = saleRepository.findByCreatedAtBetween(start.atStartOfDay(), end.plusDays(1).atStartOfDay());

        Map<String, Integer> stockTrend = new LinkedHashMap<>();
        Map<String, Integer> stockInTrend = new LinkedHashMap<>();
        Map<String, Integer> stockOutTrend = new LinkedHashMap<>();
        Map<String, BigDecimal> valueTrend = new LinkedHashMap<>();
        for (LocalDate day = start; !day.isAfter(end); day = day.plusDays(1)) {
            String key = day.toString();
            stockTrend.put(key, 0);
            stockInTrend.put(key, 0);
            stockOutTrend.put(key, 0);
            valueTrend.put(key, BigDecimal.ZERO);
        }

        for (InventoryItem item : items) {
            if (item.getLastStockedAt() != null) {
                LocalDate stockDate = item.getLastStockedAt().toLocalDate();
                if (!stockDate.isBefore(start) && !stockDate.isAfter(end)) {
                    String key = stockDate.toString();
                    int quantity = Math.max(0, item.getQuantity() == null ? 0 : item.getQuantity());
                    stockTrend.put(key, stockTrend.getOrDefault(key, 0) + quantity);
                    stockInTrend.put(key, stockInTrend.getOrDefault(key, 0) + quantity);

                    BigDecimal unitCost = item.getPurchaseCost() != null ? item.getPurchaseCost() : item.getPrice();
                    BigDecimal inValue = (unitCost == null ? BigDecimal.ZERO : unitCost).multiply(BigDecimal.valueOf(quantity));
                    valueTrend.put(key, valueTrend.getOrDefault(key, BigDecimal.ZERO).add(inValue));
                }
            }
        }

        for (Sale sale : salesInRange) {
            if (sale.getCreatedAt() == null) continue;
            String key = sale.getCreatedAt().toLocalDate().toString();
            int soldUnits = 0;
            BigDecimal soldValue = BigDecimal.ZERO;
            if (sale.getItems() != null) {
                for (SaleItem item : sale.getItems()) {
                    int qty = item.getQuantity() == null ? 0 : item.getQuantity();
                    soldUnits += qty;
                    BigDecimal unitPrice = item.getUnitPrice() == null ? BigDecimal.ZERO : item.getUnitPrice();
                    soldValue = soldValue.add(unitPrice.multiply(BigDecimal.valueOf(qty)));
                }
            }
            stockOutTrend.put(key, stockOutTrend.getOrDefault(key, 0) + soldUnits);
            valueTrend.put(key, valueTrend.getOrDefault(key, BigDecimal.ZERO).subtract(soldValue));
        }

        Map<String, Integer> categoryCounts = new LinkedHashMap<>();
        Map<String, BigDecimal> categoryValue = new LinkedHashMap<>();
        for (InventoryItem item : items) {
            String category = (item.getCategory() == null || item.getCategory().isBlank()) ? "Uncategorized" : item.getCategory();
            categoryCounts.put(category, categoryCounts.getOrDefault(category, 0) + 1);
            BigDecimal unitCost = item.getPurchaseCost() != null ? item.getPurchaseCost() : item.getPrice();
            BigDecimal value = (unitCost == null ? BigDecimal.ZERO : unitCost).multiply(BigDecimal.valueOf(item.getQuantity() == null ? 0 : item.getQuantity()));
            categoryValue.put(category, categoryValue.getOrDefault(category, BigDecimal.ZERO).add(value));
        }

        long lowStockCount = items.stream()
                .filter(i -> i.getQuantity() != null && i.getReorderPoint() != null && i.getQuantity() <= i.getReorderPoint())
                .count();

        var lowStockTop = items.stream()
                .filter(i -> i.getQuantity() != null && i.getReorderPoint() != null && i.getQuantity() <= i.getReorderPoint())
                .sorted((a, b) -> Integer.compare(a.getQuantity(), b.getQuantity()))
                .limit(5)
                .map(i -> Map.<String, Object>of(
                        "name", i.getName(),
                        "category", i.getCategory(),
                        "quantity", i.getQuantity(),
                        "reorderPoint", i.getReorderPoint()
                ))
                .collect(Collectors.toList());

        return Map.of(
                "periodDays", periodDays,
                "stockTrend", stockTrend.entrySet().stream()
                        .map(e -> Map.of("date", e.getKey(), "stock", e.getValue()))
                        .toList(),
                "stockFlowTrend", stockTrend.keySet().stream()
                        .map(date -> Map.<String, Object>of(
                                "date", date,
                                "stockIn", stockInTrend.getOrDefault(date, 0),
                                "stockOut", stockOutTrend.getOrDefault(date, 0)
                        ))
                        .toList(),
                "valueTrend", valueTrend.entrySet().stream()
                        .map(e -> Map.<String, Object>of("date", e.getKey(), "netValueChange", e.getValue()))
                        .toList(),
                "categoryDistribution", categoryCounts.entrySet().stream()
                        .map(e -> Map.of("name", e.getKey(), "value", e.getValue()))
                        .toList(),
                "categoryValue", categoryValue.entrySet().stream()
                        .map(e -> Map.of("name", e.getKey(), "value", e.getValue()))
                        .toList(),
                "lowStockCount", lowStockCount,
                "lowStockTop", lowStockTop
        );
    }

    @Transactional
    public InventoryItem create(InventoryDtos.InventoryItemRequest request) {
        ensureCategoryExists(request.category());
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
        ensureCategoryExists(request.category());
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

    private void ensureCategoryExists(String categoryName) {
        if (categoryName == null || categoryName.isBlank()) {
            return;
        }
        categoryRepository.findByNameIgnoreCase(categoryName).orElseGet(() -> {
            Category category = new Category();
            category.setName(categoryName.trim());
            category.setDescription("Auto-created from inventory item");
            return categoryRepository.save(category);
        });
    }
}
