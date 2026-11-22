package com.ecr.ams.modules.asset.service;

import com.ecr.ams.exception.DuplicateResourceException;
import com.ecr.ams.exception.ResourceNotFoundException;
import com.ecr.ams.modules.asset.dto.AssetCreateRequest;
import com.ecr.ams.modules.asset.dto.AssetResponse;
import com.ecr.ams.modules.asset.entity.Asset;
import com.ecr.ams.modules.asset.enums.AssetStatus;
import com.ecr.ams.modules.asset.repository.AssetRepository;
import com.ecr.ams.modules.vendor.entity.Vendor;
import com.ecr.ams.modules.vendor.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class AssetService {
    private final AssetRepository assetRepository;
    private final VendorRepository vendorRepository;

    @Transactional
    public AssetResponse createAsset(AssetCreateRequest request) {
        if (assetRepository.existsBySerialNumber(request.getSerialNumber())) {
            throw new DuplicateResourceException("Asset with serial number '" + request.getSerialNumber() + "' already exists");
        }
        Asset asset = new Asset();
        asset.setName(request.getName());
        asset.setAssetType(request.getAssetType());
        asset.setSerialNumber(request.getSerialNumber());
        asset.setPurchaseDate(request.getPurchaseDate());
        asset.setPurchaseCost(request.getPurchaseCost());
        
        if (request.getVendorId() != null && !request.getVendorId().isEmpty()) {
            Vendor vendor = vendorRepository.findById(request.getVendorId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with id: " + request.getVendorId()));
            asset.setVendor(vendor);
        }
        
        asset = assetRepository.save(asset); // save to get ID if needed
        if (asset.getQrCode() == null || asset.getQrCode().isEmpty() || !asset.getQrCode().startsWith("http")) {
            asset.setQrCode("https://localhost:8082/assets/public/" + asset.getId());
            asset = assetRepository.save(asset);
        }
        asset.setStatus(AssetStatus.AVAILABLE);
        return mapToResponse(assetRepository.save(asset));
    }

    @Transactional(readOnly = true)
    public Page<AssetResponse> searchAssets(AssetStatus status, String vendorId, Pageable pageable) {
        Page<Asset> assets;
        if (status != null && vendorId != null && !vendorId.isEmpty()) {
            assets = assetRepository.findByStatusAndVendorId(status, vendorId, pageable);
        } else if (status != null) {
            assets = assetRepository.findByStatus(status, pageable);
        } else if (vendorId != null && !vendorId.isEmpty()) {
            assets = assetRepository.findByVendorId(vendorId, pageable);
        } else {
            assets = assetRepository.findAll(pageable);
        }
        return assets.map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public java.util.List<AssetResponse> getWarrantyAlerts(int daysAhead) {
        java.time.LocalDate targetDate = java.time.LocalDate.now().plusDays(daysAhead);
        java.util.List<Asset> assets = assetRepository.findAssetsWithWarrantyExpiringBefore(targetDate);
        return assets.stream().map(this::mapToResponse).collect(java.util.stream.Collectors.toList());
    }

    // --- NEW: UPDATE METHOD ---
    @Transactional
    public AssetResponse updateAsset(String id, AssetCreateRequest request) {
        Asset asset = assetRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + id));
            
        asset.setName(request.getName());
        asset.setAssetType(request.getAssetType());
        asset.setSerialNumber(request.getSerialNumber());
        asset.setPurchaseDate(request.getPurchaseDate());
        asset.setPurchaseCost(request.getPurchaseCost());
        
        if (request.getVendorId() != null && !request.getVendorId().isEmpty()) {
            Vendor vendor = vendorRepository.findById(request.getVendorId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with id: " + request.getVendorId()));
            asset.setVendor(vendor);
        } else {
            asset.setVendor(null);
        }
        
        if (asset.getQrCode() == null || asset.getQrCode().isEmpty() || !asset.getQrCode().startsWith("http")) {
            asset.setQrCode("https://localhost:8082/assets/public/" + asset.getId());
        }
        
        return mapToResponse(assetRepository.save(asset));
    }

    // --- NEW: DELETE METHOD ---
    @Transactional
    public void deleteAsset(String id) {
        // Because of @Where(clause="is_deleted=false"), findById will return empty if already deleted
        Asset asset = assetRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + id));
        
        // Calling delete() triggers the @SQLDelete annotation, updating is_deleted=true
        assetRepository.delete(asset);
    }

    private AssetResponse mapToResponse(Asset asset) {
        AssetResponse response = AssetResponse.builder()
                .id(asset.getId()).name(asset.getName()).assetType(asset.getAssetType())
                .brand(asset.getBrand()).model(asset.getModel())
                .serialNumber(asset.getSerialNumber()).purchaseDate(asset.getPurchaseDate())
                .purchaseCost(asset.getPurchaseCost()).status(asset.getStatus())
                .department(asset.getDepartment()).location(asset.getLocation())
                .warrantyExpiry(asset.getWarrantyExpiry())
                .qrCode(asset.getQrCode()).createdAt(asset.getCreatedAt()).build();
        if (asset.getVendor() != null) {
            response.setVendorId(asset.getVendor().getId());
            response.setVendorName(asset.getVendor().getName());
        }
        return response;
    }
}