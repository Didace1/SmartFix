package com.aidevice.smartfix.repository;

import com.aidevice.smartfix.model.RepairTask;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RepairTaskRepository extends JpaRepository<RepairTask, Long> {
    List<RepairTask> findByStatus(String status);
    List<RepairTask> findByAssignedTechnicianId(Long technicianId);
}
