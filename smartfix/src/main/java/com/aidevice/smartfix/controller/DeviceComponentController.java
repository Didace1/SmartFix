package com.aidevice.smartfix.controller;

import com.aidevice.smartfix.model.Device;
import com.aidevice.smartfix.model.DeviceComponent;
import com.aidevice.smartfix.repository.DeviceComponentRepository;
import com.aidevice.smartfix.repository.DeviceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/components")
public class DeviceComponentController {
    private final DeviceComponentRepository componentRepository;
    private final DeviceRepository deviceRepository;

    public DeviceComponentController(DeviceComponentRepository componentRepository,
                                      DeviceRepository deviceRepository) {
        this.componentRepository = componentRepository;
        this.deviceRepository = deviceRepository;
    }

    @GetMapping
    public List<DeviceComponent> getAll() {
        return componentRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeviceComponent> getById(@PathVariable Long id) {
        return componentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/device/{deviceId}")
    public List<DeviceComponent> getByDevice(@PathVariable Long deviceId) {
        return componentRepository.findByDeviceId(deviceId);
    }

    @GetMapping("/alerts")
    public List<DeviceComponent> getHighRisk() {
        return componentRepository.findAll().stream()
                .filter(c -> c.getFailureProbability().compareTo(new BigDecimal("70")) >= 0)
                .toList();
    }

    @PostMapping
    public DeviceComponent create(@RequestBody Map<String, Object> body) {
        DeviceComponent component = new DeviceComponent();
        component.setName((String) body.get("name"));

        Object healthScore = body.get("healthScore");
        component.setHealthScore(healthScore != null
                ? new BigDecimal(healthScore.toString()) : new BigDecimal("100"));

        Object failureProb = body.get("failureProbability");
        component.setFailureProbability(failureProb != null
                ? new BigDecimal(failureProb.toString()) : BigDecimal.ZERO);

        Object predictedLife = body.get("predictedLifeDays");
        if (predictedLife != null) {
            component.setPredictedLifeDays(Integer.valueOf(predictedLife.toString()));
        }

        component.setLastAssessed(LocalDate.now());
        component.setAlertSent(false);
        component.setCreatedAt(LocalDateTime.now());

        Object deviceId = body.get("deviceId");
        if (deviceId != null) {
            Device device = deviceRepository.findById(Long.valueOf(deviceId.toString())).orElse(null);
            component.setDevice(device);
        }

        return componentRepository.save(component);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeviceComponent> update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        DeviceComponent component = componentRepository.findById(id).orElse(null);
        if (component == null) return ResponseEntity.notFound().build();

        if (body.containsKey("healthScore")) {
            component.setHealthScore(new BigDecimal(body.get("healthScore").toString()));
        }
        if (body.containsKey("failureProbability")) {
            component.setFailureProbability(new BigDecimal(body.get("failureProbability").toString()));
        }
        if (body.containsKey("predictedLifeDays")) {
            component.setPredictedLifeDays(Integer.valueOf(body.get("predictedLifeDays").toString()));
        }
        component.setLastAssessed(LocalDate.now());

        return ResponseEntity.ok(componentRepository.save(component));
    }

    @PutMapping("/{id}/alert")
    public ResponseEntity<DeviceComponent> markAlertSent(@PathVariable Long id) {
        DeviceComponent component = componentRepository.findById(id).orElse(null);
        if (component == null) return ResponseEntity.notFound().build();
        component.setAlertSent(true);
        return ResponseEntity.ok(componentRepository.save(component));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        componentRepository.deleteById(id);
    }
}
