package com.ecr.ams.modules.assetassignment.controller;

import com.ecr.ams.modules.assetassignment.dto.AssetAssignmentResponse;
import com.ecr.ams.modules.assetassignment.service.AssetAssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus; import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap; import java.util.List; import java.util.Map;

@RestController @RequestMapping("/api/v1") @RequiredArgsConstructor
public class AssetAssignmentController {
    private final AssetAssignmentService assignmentService;

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @PostMapping("/assets/{assetId}/assign/{employeeId}")
    public ResponseEntity<Map<String, Object>> assign(@PathVariable String assetId, @PathVariable String employeeId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ok("Asset assigned successfully", assignmentService.assignAsset(assetId, employeeId)));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @PostMapping("/assets/{assetId}/return")
    public ResponseEntity<Map<String, Object>> returnAsset(@PathVariable String assetId) {
        return ResponseEntity.ok(ok("Asset returned successfully", assignmentService.returnAsset(assetId)));
    }

    @GetMapping("/assets/{assetId}/history")
    public ResponseEntity<Map<String, Object>> history(@PathVariable String assetId) {
        return ResponseEntity.ok(ok("Asset history retrieved", assignmentService.getAssetHistory(assetId)));
    }

    @GetMapping("/employees/{employeeId}/assets")
    public ResponseEntity<Map<String, Object>> empAssets(@PathVariable String employeeId) {
        return ResponseEntity.ok(ok("Employee assets retrieved", assignmentService.getEmployeeAssets(employeeId)));
    }

    private Map<String, Object> ok(String msg, Object data) {
        Map<String, Object> r = new HashMap<>();
        r.put("success", true); r.put("message", msg); r.put("data", data); r.put("timestamp", java.time.LocalDateTime.now().toString());
        return r;
    }
}