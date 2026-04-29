package com.aidevice.smartfix.config;

import com.aidevice.smartfix.model.InventoryItem;
import com.aidevice.smartfix.model.User;
import com.aidevice.smartfix.repository.InventoryItemRepository;
import com.aidevice.smartfix.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedUsers(UserRepository userRepository, PasswordEncoder passwordEncoder, InventoryItemRepository inventoryItemRepository) {
        return args -> {
            seedUser(userRepository, passwordEncoder, "John Administrator", "admin@corexltd.com", "admin123", "admin", "ADMIN001");
            seedUser(userRepository, passwordEncoder, "Sarah Technician", "technician@corexltd.com", "tech123", "technician", "TECH001");
            seedUser(userRepository, passwordEncoder, "Mike Manager", "manager@corexltd.com", "manager123", "manager", "MGR001");
            seedUser(userRepository, passwordEncoder, "Lisa Inventory", "inventory@corexltd.com", "inv123", "inventory", "INV001");
            seedUser(userRepository, passwordEncoder, "David Sales", "sales@corexltd.com", "sales123", "sales", "SALES001");
            seedInventory(inventoryItemRepository);
        };
    }

    private void seedUser(UserRepository repo, PasswordEncoder encoder, String fullName, String email, String rawPassword, String role, String employeeId) {
        if (repo.findByEmail(email).isPresent()) return;
        User user = new User();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPassword(encoder.encode(rawPassword));
        user.setRole(role);
        user.setEmployeeId(employeeId);
        user.setPhone("");
        user.setSpecialization("");
        user.setCertifications("");
        user.setApproved(true);
        repo.save(user);
    }

    private void seedInventory(InventoryItemRepository repo) {
        if (repo.count() > 0) return;
        seedItem(repo, "Laptop Battery", "Batteries", 5, 10, new BigDecimal("89.99"), "BatteryTech", "BAT-001");
        seedItem(repo, "SSD 1TB", "Storage", 3, 5, new BigDecimal("129.99"), "StoragePro", "SSD-001");
        seedItem(repo, "Laptop Screen 15.6\"", "Screens", 8, 5, new BigDecimal("159.99"), "DisplayTech", "SCR-001");
        seedItem(repo, "RAM 8GB", "Memory", 12, 8, new BigDecimal("49.99"), "MemoryWorld", "RAM-001");
        seedItem(repo, "Power Adapter", "Accessories", 2, 5, new BigDecimal("39.99"), "PowerTech", "PWR-001");
        seedItem(repo, "Cooling Fan", "Cooling", 6, 4, new BigDecimal("24.99"), "CoolMaster", "FAN-001");
    }

    private void seedItem(InventoryItemRepository repo, String name, String category, int qty, int reorderPoint, BigDecimal price, String supplier, String sku) {
        InventoryItem item = new InventoryItem();
        item.setName(name);
        item.setCategory(category);
        item.setQuantity(qty);
        item.setReorderPoint(reorderPoint);
        item.setPrice(price);
        item.setSupplier(supplier);
        item.setSku(sku);
        repo.save(item);
    }
}
