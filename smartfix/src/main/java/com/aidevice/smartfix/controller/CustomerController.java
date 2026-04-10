package com.aidevice.smartfix.controller;

import com.aidevice.smartfix.model.Sale;
import com.aidevice.smartfix.service.SalesService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    private final SalesService salesService;

    public CustomerController(SalesService salesService) {
        this.salesService = salesService;
    }

    @GetMapping
    public List<Map<String, Object>> customers() {
        List<Sale> sales = salesService.getAllSales();
        Map<String, Map<String, Object>> grouped = new LinkedHashMap<>();
        for (Sale sale : sales) {
            String key = sale.getCustomerName();
            grouped.putIfAbsent(key, new LinkedHashMap<>());
            Map<String, Object> customer = grouped.get(key);
            customer.put("name", sale.getCustomerName());
            customer.put("email", sale.getCustomerEmail());
            customer.put("phone", sale.getCustomerPhone());
            customer.put("totalPurchases", ((Number) customer.getOrDefault("totalPurchases", 0)).intValue() + 1);
        }
        return new ArrayList<>(grouped.values());
    }
}
