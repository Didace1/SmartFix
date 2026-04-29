package com.aidevice.smartfix.repository;

import com.aidevice.smartfix.model.Device;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DeviceRepository extends JpaRepository<Device, Long> {
    Optional<Device> findBySerialNumber(String serialNumber);
    List<Device> findByCustomerId(Long customerId);
    List<Device> findByDeviceType(String deviceType);
}
