package com.aidevice.smartfix.controller;

import com.aidevice.smartfix.model.InventoryItem;
import com.aidevice.smartfix.model.Sale;
import com.aidevice.smartfix.repository.UserRepository;
import com.aidevice.smartfix.service.InventoryService;
import com.aidevice.smartfix.service.SalesService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/reports")
public class ReportsController {
    private final InventoryService inventoryService;
    private final SalesService salesService;
    private final UserRepository userRepository;

    public ReportsController(InventoryService inventoryService, SalesService salesService, UserRepository userRepository) {
        this.inventoryService = inventoryService;
        this.salesService = salesService;
        this.userRepository = userRepository;
    }

    @GetMapping("/summary")
    public Map<String, Object> summary() {
        List<InventoryItem> inventory = inventoryService.getAll();
        List<Sale> sales = salesService.getAllSales();

        BigDecimal totalInventoryValue = inventory.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Long> categoryDistribution = new LinkedHashMap<>();
        for (InventoryItem item : inventory) {
            categoryDistribution.put(item.getCategory(), categoryDistribution.getOrDefault(item.getCategory(), 0L) + 1);
        }

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("totalUsers", userRepository.count());
        data.put("totalSalesCount", sales.size());
        data.put("totalRevenue", sales.stream().map(Sale::getTotal).reduce(BigDecimal.ZERO, BigDecimal::add));
        data.put("inventoryCount", inventory.size());
        data.put("inventoryValue", totalInventoryValue);
        data.put("lowStockCount", inventory.stream().filter(i -> i.getQuantity() <= i.getReorderPoint()).count());
        data.put("categoryDistribution", categoryDistribution);
        return data;
    }

    @GetMapping("/activities")
    public List<Map<String, Object>> activities() {
        List<Map<String, Object>> activities = new ArrayList<>();

        List<Sale> sales = salesService.getAllSales();
        sales.stream()
                .sorted(Comparator.comparing(Sale::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .limit(5)
                .forEach(sale -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("id", "sale-" + sale.getId());
                    row.put("type", "sales");
                    row.put("title", "Sale completed for " + sale.getCustomerName());
                    row.put("customer", sale.getCustomerName());
                    row.put("timestamp", sale.getCreatedAt() != null ? sale.getCreatedAt().toString() : LocalDate.now().toString());
                    row.put("status", "completed");
                    activities.add(row);
                });

        inventoryService.getAll().stream()
                .filter(item -> item.getQuantity() <= item.getReorderPoint())
                .limit(3)
                .forEach(item -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("id", "stock-" + item.getId());
                    row.put("type", "inventory");
                    row.put("title", "Low stock alert: " + item.getName());
                    row.put("timestamp", LocalDate.now().toString());
                    row.put("status", "alert");
                    activities.add(row);
                });

        return activities;
    }
}
