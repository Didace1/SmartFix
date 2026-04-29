package com.aidevice.smartfix.controller;

import com.aidevice.smartfix.model.Customer;
import com.aidevice.smartfix.model.Device;
import com.aidevice.smartfix.repository.CustomerRepository;
import com.aidevice.smartfix.repository.DeviceRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {
    private final DeviceRepository deviceRepository;
    private final CustomerRepository customerRepository;

    public DeviceController(DeviceRepository deviceRepository, CustomerRepository customerRepository) {
        this.deviceRepository = deviceRepository;
        this.customerRepository = customerRepository;
    }

    @GetMapping
    public List<Device> getAll() {
        return deviceRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Device> getById(@PathVariable Long id) {
        return deviceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/customer/{customerId}")
    public List<Device> getByCustomer(@PathVariable Long customerId) {
        return deviceRepository.findByCustomerId(customerId);
    }

    @PostMapping
    public Device create(@RequestBody Map<String, Object> body) {
        Device device = new Device();
        device.setBrand((String) body.get("brand"));
        device.setModel((String) body.get("model"));
        device.setDeviceType((String) body.getOrDefault("deviceType", "OTHER"));
        device.setSerialNumber((String) body.get("serialNumber"));
        device.setCreatedAt(LocalDateTime.now());

        if (body.get("purchaseDate") != null) {
            device.setPurchaseDate(LocalDate.parse((String) body.get("purchaseDate")));
        }
        if (body.get("warrantyExpiry") != null) {
            device.setWarrantyExpiry(LocalDate.parse((String) body.get("warrantyExpiry")));
        }

        Object customerId = body.get("customerId");
        if (customerId != null) {
            Customer customer = customerRepository.findById(Long.valueOf(customerId.toString()))
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Customer not found"));
            device.setCustomer(customer);
        }

        return deviceRepository.save(device);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Device> update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Device device = deviceRepository.findById(id).orElse(null);
        if (device == null) return ResponseEntity.notFound().build();

        if (body.containsKey("brand")) device.setBrand((String) body.get("brand"));
        if (body.containsKey("model")) device.setModel((String) body.get("model"));
        if (body.containsKey("deviceType")) device.setDeviceType((String) body.get("deviceType"));
        if (body.containsKey("serialNumber")) device.setSerialNumber((String) body.get("serialNumber"));

        return ResponseEntity.ok(deviceRepository.save(device));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        deviceRepository.deleteById(id);
    }
}
