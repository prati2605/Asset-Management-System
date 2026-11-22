package com.ecr.ams.modules.maintenance.controller;

import com.ecr.ams.common.dto.ApiResponse;
import com.ecr.ams.modules.maintenance.dto.MaintenanceRequest;
import com.ecr.ams.modules.maintenance.dto.MaintenanceResponse;
import com.ecr.ams.modules.maintenance.enums.MaintenancePriority;
import com.ecr.ams.modules.maintenance.enums.MaintenanceStatus;
import com.ecr.ams.modules.maintenance.service.MaintenanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/maintenance")
@RequiredArgsConstructor
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @PostMapping
    public ResponseEntity<ApiResponse<MaintenanceResponse>> createTicket(@Valid @RequestBody MaintenanceRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Maintenance ticket created successfully", maintenanceService.createMaintenance(request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<MaintenanceResponse>>> getTickets(
            @RequestParam(required = false) MaintenanceStatus status,
            @RequestParam(required = false) MaintenancePriority priority,
            @RequestParam(required = false) String assetId,
            @RequestParam(required = false) String vendorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        if (size > 100) size = 100;
        return ResponseEntity.ok(ApiResponse.success("Maintenance tickets retrieved successfully", 
                maintenanceService.getMaintenanceTickets(status, priority, assetId, vendorId, PageRequest.of(page, size))));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MaintenanceResponse>> getTicketById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success("Maintenance ticket retrieved successfully", maintenanceService.getMaintenanceById(id)));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MaintenanceResponse>> updateTicket(
            @PathVariable String id,
            @Valid @RequestBody MaintenanceRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Maintenance ticket updated successfully", maintenanceService.updateMaintenance(id, request)));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTicket(@PathVariable String id) {
        maintenanceService.deleteMaintenance(id);
        return ResponseEntity.ok(ApiResponse.success("Maintenance ticket deleted successfully", null));
    }
}
