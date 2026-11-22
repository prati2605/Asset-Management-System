package com.ecr.ams.modules.dashboard.controller;

import com.ecr.ams.modules.dashboard.dto.DashboardStatsResponse;
import com.ecr.ams.modules.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        DashboardStatsResponse stats = dashboardService.getStats();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Dashboard statistics retrieved successfully");
        response.put("data", stats);
        response.put("timestamp", LocalDateTime.now().toString());
        
        return ResponseEntity.ok(response);
    }
}
