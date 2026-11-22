package com.ecr.ams.modules.asset.controller;

import java.util.Map;
import org.springframework.web.bind.annotation.PathVariable;

import com.ecr.ams.common.dto.ApiResponse;
import com.ecr.ams.modules.asset.dto.AssetCreateRequest;
import com.ecr.ams.modules.asset.dto.AssetResponse;
import com.ecr.ams.modules.asset.enums.AssetStatus;
import com.ecr.ams.modules.asset.service.AssetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/assets")
@RequiredArgsConstructor
public class AssetController {
    private final AssetService assetService;

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @PostMapping
    public ResponseEntity<ApiResponse<AssetResponse>> createAsset(@Valid @RequestBody AssetCreateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Asset created successfully", assetService.createAsset(request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<AssetResponse>>> searchAssets(
            @RequestParam(required = false) AssetStatus status,
            @RequestParam(required = false) String vendorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        if (size > 100) size = 100; 
        return ResponseEntity.ok(ApiResponse.success("Assets retrieved successfully", assetService.searchAssets(status, vendorId, PageRequest.of(page, size))));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AssetResponse>> updateAsset(@PathVariable String id, @Valid @RequestBody AssetCreateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Asset updated successfully", assetService.updateAsset(id, request)));
    }

    // --- NEW: DELETE ENDPOINT ---
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAsset(@PathVariable String id) {
        assetService.deleteAsset(id);
        return ResponseEntity.ok(ApiResponse.success("Asset deleted successfully", null));
    }

    @GetMapping("/warranty-alerts")
    public ResponseEntity<ApiResponse<java.util.List<AssetResponse>>> getWarrantyAlerts(
            @RequestParam(defaultValue = "30") int daysAhead) {
        return ResponseEntity.ok(ApiResponse.success("Warranty alerts retrieved successfully", assetService.getWarrantyAlerts(daysAhead)));
    }
}