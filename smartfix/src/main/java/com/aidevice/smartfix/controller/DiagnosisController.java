package com.aidevice.smartfix.controller;

import com.aidevice.smartfix.model.Device;
import com.aidevice.smartfix.model.Diagnosis;
import com.aidevice.smartfix.model.User;
import com.aidevice.smartfix.repository.DeviceRepository;
import com.aidevice.smartfix.repository.DiagnosisRepository;
import com.aidevice.smartfix.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/diagnoses")
public class DiagnosisController {
    private final DiagnosisRepository diagnosisRepository;
    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;

    public DiagnosisController(DiagnosisRepository diagnosisRepository,
                                DeviceRepository deviceRepository,
                                UserRepository userRepository) {
        this.diagnosisRepository = diagnosisRepository;
        this.deviceRepository = deviceRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Diagnosis> getAll() {
        return diagnosisRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Diagnosis> getById(@PathVariable Long id) {
        return diagnosisRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/device/{deviceId}")
    public List<Diagnosis> getByDevice(@PathVariable Long deviceId) {
        return diagnosisRepository.findByDeviceId(deviceId);
    }

    @GetMapping("/technician/{technicianId}")
    public List<Diagnosis> getByTechnician(@PathVariable Long technicianId) {
        return diagnosisRepository.findByTechnicianId(technicianId);
    }

    @PostMapping
    public Diagnosis create(@RequestBody Map<String, Object> body) {
        Diagnosis diagnosis = new Diagnosis();

        String symptoms = (String) body.get("symptomsText");
        if (symptoms == null || symptoms.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Symptoms text is required");
        }
        diagnosis.setSymptomsText(symptoms);

        String aiResult = (String) body.get("aiResult");
        if (aiResult == null || aiResult.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "AI result is required");
        }
        diagnosis.setAiResult(aiResult);

        Object confidence = body.get("confidenceScore");
        if (confidence != null) {
            diagnosis.setConfidenceScore(new BigDecimal(confidence.toString()));
        } else {
            diagnosis.setConfidenceScore(BigDecimal.ZERO);
        }

        diagnosis.setSymptomsChecklist((String) body.get("symptomsChecklist"));
        diagnosis.setImagePaths((String) body.get("imagePaths"));
        diagnosis.setCreatedAt(LocalDateTime.now());

        Object deviceId = body.get("deviceId");
        if (deviceId != null) {
            Device device = deviceRepository.findById(Long.valueOf(deviceId.toString())).orElse(null);
            diagnosis.setDevice(device);
        }

        Object technicianId = body.get("technicianId");
        if (technicianId != null) {
            User technician = userRepository.findById(Long.valueOf(technicianId.toString())).orElse(null);
            diagnosis.setTechnician(technician);
        }

        return diagnosisRepository.save(diagnosis);
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<Diagnosis> confirm(@PathVariable Long id) {
        Diagnosis diagnosis = diagnosisRepository.findById(id).orElse(null);
        if (diagnosis == null) return ResponseEntity.notFound().build();
        diagnosis.setTechnicianConfirmed(true);
        return ResponseEntity.ok(diagnosisRepository.save(diagnosis));
    }
}
