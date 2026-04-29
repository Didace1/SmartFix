package com.aidevice.smartfix.controller;

import com.aidevice.smartfix.model.Customer;
import com.aidevice.smartfix.model.Sale;
import com.aidevice.smartfix.service.CustomerService;
import com.aidevice.smartfix.service.SalesService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    private final CustomerService customerService;
    private final SalesService salesService;

    public CustomerController(CustomerService customerService, SalesService salesService) {
        this.customerService = customerService;
        this.salesService = salesService;
    }

    @GetMapping
    public List<Customer> getAll() {
        return customerService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getById(@PathVariable Long id) {
        return customerService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<Customer> search(@RequestParam String q) {
        return customerService.search(q);
    }

    @PostMapping
    public Customer create(@RequestBody Customer customer) {
        try {
            return customerService.create(customer);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        }
    }

    @PutMapping("/{id}")
    public Customer update(@PathVariable Long id, @RequestBody Customer customer) {
        try {
            return customerService.update(id, customer);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        customerService.delete(id);
    }

    @GetMapping("/from-sales")
    public List<Map<String, Object>> customersFromSales() {
        List<Sale> sales = salesService.getAllSales();
        Map<String, Map<String, Object>> grouped = new LinkedHashMap<>();
        for (Sale sale : sales) {
            String key = sale.getCustomerName();
            grouped.putIfAbsent(key, new LinkedHashMap<>());
            Map<String, Object> c = grouped.get(key);
            c.put("name", sale.getCustomerName());
            c.put("email", sale.getCustomerEmail());
            c.put("phone", sale.getCustomerPhone());
            c.put("totalPurchases", ((Number) c.getOrDefault("totalPurchases", 0)).intValue() + 1);
        }
        return new ArrayList<>(grouped.values());
    }
}
