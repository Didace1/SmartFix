package com.aidevice.smartfix.controller;

import com.aidevice.smartfix.dto.TechnicianPerformanceDTO.*;
import com.aidevice.smartfix.service.TechnicianPerformanceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Technician Performance Dashboard
 * Phase 3: Performance Tracking and Analytics
 */
@RestController
@RequestMapping("/api/performance")
@RequiredArgsConstructor
@Slf4j
public class PerformanceController {

    private final TechnicianPerformanceService performanceService;

    /**
     * Get complete performance dashboard
     * GET /api/performance/dashboard
     */
    @GetMapping("/dashboard")
    public ResponseEntity<PerformanceDashboard> getPerformanceDashboard() {
        log.info("Fetching performance dashboard");
        PerformanceDashboard dashboard = performanceService.getPerformanceDashboard();
        return ResponseEntity.ok(dashboard);
    }

    /**
     * Get detailed performance for a specific technician
     * GET /api/performance/technician/{id}
     */
    @GetMapping("/technician/{id}")
    public ResponseEntity<TechnicianDetailedPerformance> getTechnicianPerformance(@PathVariable Long id) {
        log.info("Fetching performance for technician {}", id);
        TechnicianDetailedPerformance performance = performanceService.getTechnicianPerformance(id);
        return ResponseEntity.ok(performance);
    }
}
