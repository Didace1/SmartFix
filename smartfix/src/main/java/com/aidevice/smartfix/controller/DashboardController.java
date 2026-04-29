package com.aidevice.smartfix.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aidevice.smartfix.model.InventoryItem;
import com.aidevice.smartfix.model.RepairTask;
import com.aidevice.smartfix.model.Sale;
import com.aidevice.smartfix.repository.CustomerRepository;
import com.aidevice.smartfix.repository.DeviceComponentRepository;
import com.aidevice.smartfix.repository.DeviceRepository;
import com.aidevice.smartfix.repository.DiagnosisRepository;
import com.aidevice.smartfix.repository.RepairTaskRepository;
import com.aidevice.smartfix.repository.UserRepository;
import com.aidevice.smartfix.service.InventoryService;
import com.aidevice.smartfix.service.SalesService;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final InventoryService inventoryService;
    private final SalesService salesService;
    private final UserRepository userRepository;
    private final RepairTaskRepository repairTaskRepository;
    private final CustomerRepository customerRepository;
    private final DeviceRepository deviceRepository;
    private final DiagnosisRepository diagnosisRepository;
    private final DeviceComponentRepository componentRepository;

    public DashboardController(InventoryService inventoryService, SalesService salesService,
                                UserRepository userRepository, RepairTaskRepository repairTaskRepository,
                                CustomerRepository customerRepository, DeviceRepository deviceRepository,
                                DiagnosisRepository diagnosisRepository, DeviceComponentRepository componentRepository) {
        this.inventoryService = inventoryService;
        this.salesService = salesService;
        this.userRepository = userRepository;
        this.repairTaskRepository = repairTaskRepository;
        this.customerRepository = customerRepository;
        this.deviceRepository = deviceRepository;
        this.diagnosisRepository = diagnosisRepository;
        this.componentRepository = componentRepository;
    }

    @GetMapping("/summary")
    public Map<String, Object> summary() {
        List<InventoryItem> items = inventoryService.getAll();
        List<Sale> sales = salesService.getAllSales();
        List<RepairTask> tasks = repairTaskRepository.findAll();
        LocalDate today = LocalDate.now();

        int lowStock = (int) items.stream().filter(i -> i.getQuantity() != null && i.getReorderPoint() != null && i.getQuantity() <= i.getReorderPoint()).count();
        BigDecimal todayRevenue = sales.stream()
                .filter(s -> s.getCreatedAt() != null && s.getCreatedAt().toLocalDate().equals(today))
                .map(s -> s.getTotal() != null ? s.getTotal() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long pendingRepairs  = tasks.stream().filter(t -> List.of("PENDING","ASSIGNED").contains(t.getStatus())).count();
        long activeRepairs   = tasks.stream().filter(t -> "IN_PROGRESS".equals(t.getStatus())).count();
        long completedRepairs = tasks.stream().filter(t -> "COMPLETED".equals(t.getStatus())).count();

        Map<String, Object> data = new HashMap<>();
        data.put("inventoryItems",   items.size());
        data.put("lowStockItems",    lowStock);
        data.put("salesToday",       sales.stream().filter(s -> s.getCreatedAt() != null && s.getCreatedAt().toLocalDate().equals(today)).count());
        data.put("revenueToday",     todayRevenue);
        data.put("users",            userRepository.count());
        data.put("pendingRepairs",   pendingRepairs);
        data.put("activeRepairs",    activeRepairs);
        data.put("completedRepairs", completedRepairs);
        data.put("totalRepairs",     tasks.size());
        data.put("totalCustomers",   customerRepository.count());
        data.put("totalDevices",     deviceRepository.count());
        data.put("totalDiagnoses",   diagnosisRepository.count());
        data.put("totalComponents",  componentRepository.count());
        return data;
    }
}
