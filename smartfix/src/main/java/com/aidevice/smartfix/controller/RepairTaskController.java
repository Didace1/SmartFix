package com.aidevice.smartfix.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aidevice.smartfix.model.RepairTask;
import com.aidevice.smartfix.model.User;
import com.aidevice.smartfix.repository.DeviceRepository;
import com.aidevice.smartfix.repository.DiagnosisRepository;
import com.aidevice.smartfix.repository.RepairTaskRepository;
import com.aidevice.smartfix.repository.UserRepository;

@RestController
@RequestMapping("/api/repair-tasks")
public class RepairTaskController {

    private final RepairTaskRepository repairTaskRepository;
    private final UserRepository userRepository;
    private final DeviceRepository deviceRepository;
    private final DiagnosisRepository diagnosisRepository;

    public RepairTaskController(RepairTaskRepository repairTaskRepository, UserRepository userRepository,
                                 DeviceRepository deviceRepository, DiagnosisRepository diagnosisRepository) {
        this.repairTaskRepository = repairTaskRepository;
        this.userRepository = userRepository;
        this.deviceRepository = deviceRepository;
        this.diagnosisRepository = diagnosisRepository;
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

        Object deviceId = body.get("deviceId");
        if (deviceId != null) {
            deviceRepository.findById(Long.valueOf(deviceId.toString()))
                    .ifPresent(task::setDevice);
        }

        Object diagnosisId = body.get("diagnosisId");
        if (diagnosisId != null) {
            diagnosisRepository.findById(Long.valueOf(diagnosisId.toString()))
                    .ifPresent(task::setDiagnosis);
        }

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

    @PutMapping("/{id}/escalate")
    public ResponseEntity<?> escalate(@PathVariable Long id, @RequestBody Map<String, String> body) {
        RepairTask task = repairTaskRepository.findById(id).orElse(null);
        if (task == null) {
            return ResponseEntity.notFound().build();
        }
        String note = body.getOrDefault("escalationNote", "").trim();
        if (note.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Escalation reason is required"));
        }
        task.setStatus("ESCALATED");
        task.setEscalationNote(note);
        return ResponseEntity.ok(repairTaskRepository.save(task));
    }
}
