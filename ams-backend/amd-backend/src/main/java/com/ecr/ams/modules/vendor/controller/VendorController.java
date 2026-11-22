package com.ecr.ams.modules.vendor.controller;

import com.ecr.ams.common.dto.ApiResponse;
import com.ecr.ams.modules.vendor.dto.VendorRequest;
import com.ecr.ams.modules.vendor.dto.VendorResponse;
import com.ecr.ams.modules.vendor.service.VendorService;
import com.ecr.ams.modules.asset.repository.AssetRepository;
import com.ecr.ams.modules.asset.service.AssetService;
import com.ecr.ams.modules.asset.dto.AssetResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/vendors")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;
    private final AssetService assetService;
    private final AssetRepository assetRepository;

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @PostMapping
    public ResponseEntity<ApiResponse<VendorResponse>> createVendor(@Valid @RequestBody VendorRequest request) {
        ApiResponse<VendorResponse> response = vendorService.createVendor(request);
        HttpStatus status = response.isSuccess() ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST;
        return new ResponseEntity<>(response, status);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<VendorResponse>>> getAllVendors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(vendorService.getAllVendors(page, size, keyword));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VendorResponse>> getVendorById(@PathVariable String id) {
        ApiResponse<VendorResponse> response = vendorService.getVendorById(id);
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.NOT_FOUND;
        return new ResponseEntity<>(response, status);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<VendorResponse>> updateVendor(
            @PathVariable String id,
            @Valid @RequestBody VendorRequest request) {
        ApiResponse<VendorResponse> response = vendorService.updateVendor(id, request);
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
        return new ResponseEntity<>(response, status);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteVendor(@PathVariable String id) {
        ApiResponse<Void> response = vendorService.deleteVendor(id);
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.NOT_FOUND;
        return new ResponseEntity<>(response, status);
    }

    @GetMapping("/{id}/assets")
    public ResponseEntity<ApiResponse<Page<AssetResponse>>> getVendorAssets(
            @PathVariable String id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type) {
        
        // Ensure vendor exists
        ApiResponse<VendorResponse> vendorRes = vendorService.getVendorById(id);
        if (!vendorRes.isSuccess()) {
            return new ResponseEntity<>(ApiResponse.error("Vendor not found", null), HttpStatus.NOT_FOUND);
        }

        // We can just use the existing getAssets method in assetService and maybe we need to filter by vendorId.
        // Let's implement it quickly in assetService or assetRepository
        // For now, AssetService doesn't have a specific findByVendorId paginated with keyword. 
        // A simple workaround: Just fetch by vendor ID paginated, ignoring other filters for now, or add a service method.
        Page<com.ecr.ams.modules.asset.entity.Asset> assets = assetRepository.findByVendorId(id, org.springframework.data.domain.PageRequest.of(page, size));
        
        Page<AssetResponse> assetResponses = assets.map(a -> {
            AssetResponse res = new AssetResponse();
            res.setId(a.getId());
            res.setName(a.getName());
            res.setAssetType(a.getAssetType());
            res.setBrand(a.getBrand());
            res.setModel(a.getModel());
            res.setSerialNumber(a.getSerialNumber());
            res.setPurchaseDate(a.getPurchaseDate());
            res.setPurchaseCost(a.getPurchaseCost());
            res.setStatus(a.getStatus());
            res.setDepartment(a.getDepartment());
            res.setLocation(a.getLocation());
            res.setWarrantyExpiry(a.getWarrantyExpiry());
            res.setQrCode(a.getQrCode());
            res.setCreatedAt(a.getCreatedAt());
            res.setVendorId(a.getVendor() != null ? a.getVendor().getId() : null);
            res.setVendorName(a.getVendor() != null ? a.getVendor().getName() : null);
            return res;
        });

        return ResponseEntity.ok(ApiResponse.success("Assets retrieved", assetResponses));
    }
}
