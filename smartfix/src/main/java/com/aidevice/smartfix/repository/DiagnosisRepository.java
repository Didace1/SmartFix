package com.aidevice.smartfix.repository;

import com.aidevice.smartfix.model.Diagnosis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DiagnosisRepository extends JpaRepository<Diagnosis, Long> {
    List<Diagnosis> findByDeviceId(Long deviceId);
    List<Diagnosis> findByTechnicianId(Long technicianId);
    List<Diagnosis> findByAiResult(String aiResult);
}
