package com.aidevice.smartfix.controller;

import com.aidevice.smartfix.model.RepairTask;
import com.aidevice.smartfix.model.User;
import com.aidevice.smartfix.repository.RepairTaskRepository;
import com.aidevice.smartfix.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/repair-tasks")
public class RepairTaskController {

    private final RepairTaskRepository repairTaskRepository;
    private final UserRepository userRepository;

    public RepairTaskController(RepairTaskRepository repairTaskRepository, UserRepository userRepository) {
        this.repairTaskRepository = repairTaskRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<RepairTask> list() {
        return repairTaskRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> body) {
        RepairTask task = new RepairTask();
        task.setCustomerName((String) body.getOrDefault("customerName", "Walk-in Customer"));
        task.setCustomerEmail((String) body.get("customerEmail"));
        task.setCustomerPhone((String) body.get("customerPhone"));
        task.setCustomerRef((String) body.get("customerRef"));
        task.setDeviceType((String) body.get("deviceType"));
        task.setDeviceModel((String) body.get("deviceModel"));
        task.setRepairNote((String) body.get("repairNote"));
        task.setStatus("PENDING");
        task.setCreatedAt(LocalDateTime.now());

        RepairTask saved = repairTaskRepository.save(task);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<?> assign(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        RepairTask task = repairTaskRepository.findById(id).orElse(null);
        if (task == null) {
            return ResponseEntity.notFound().build();
        }

        Object techIdObj = body.get("technicianId");
        if (techIdObj == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "technicianId is required"));
        }

        Long techId = Long.valueOf(techIdObj.toString());
        User technician = userRepository.findById(techId).orElse(null);
        if (technician == null || !"technician".equalsIgnoreCase(technician.getRole())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid technician"));
        }

        task.setAssignedTechnician(technician);
        task.setStatus("ASSIGNED");
        task.setAssignedAt(LocalDateTime.now());

        RepairTask updated = repairTaskRepository.save(task);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        RepairTask task = repairTaskRepository.findById(id).orElse(null);
        if (task == null) {
            return ResponseEntity.notFound().build();
        }
        String newStatus = body.get("status");
        if (newStatus == null || newStatus.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "status is required"));
        }
        task.setStatus(newStatus.toUpperCase());
        return ResponseEntity.ok(repairTaskRepository.save(task));
    }
}
