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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final InventoryService inventoryService;
    private final SalesService salesService;
    private final UserRepository userRepository;

    public DashboardController(InventoryService inventoryService, SalesService salesService, UserRepository userRepository) {
        this.inventoryService = inventoryService;
        this.salesService = salesService;
        this.userRepository = userRepository;
    }

    @GetMapping("/summary")
    public Map<String, Object> summary() {
        List<InventoryItem> items = inventoryService.getAll();
        List<Sale> sales = salesService.getAllSales();
        LocalDate today = LocalDate.now();

        int lowStock = (int) items.stream().filter(i -> i.getQuantity() <= i.getReorderPoint()).count();
        BigDecimal todayRevenue = sales.stream()
                .filter(s -> s.getCreatedAt() != null && s.getCreatedAt().toLocalDate().equals(today))
                .map(Sale::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> data = new HashMap<>();
        data.put("inventoryItems", items.size());
        data.put("lowStockItems", lowStock);
        data.put("salesToday", sales.stream().filter(s -> s.getCreatedAt() != null && s.getCreatedAt().toLocalDate().equals(today)).count());
        data.put("revenueToday", todayRevenue);
        data.put("users", userRepository.count());
        return data;
    }
}
