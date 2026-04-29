package com.aidevice.smartfix.repository;

import com.aidevice.smartfix.model.DeviceComponent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeviceComponentRepository extends JpaRepository<DeviceComponent, Long> {
    List<DeviceComponent> findByDeviceId(Long deviceId);
    List<DeviceComponent> findByAlertSentFalse();
}
