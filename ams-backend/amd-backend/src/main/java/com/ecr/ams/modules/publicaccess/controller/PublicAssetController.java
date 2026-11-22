package com.ecr.ams.modules.publicaccess.controller;

import com.ecr.ams.common.dto.ApiResponse;
import com.ecr.ams.exception.ResourceNotFoundException;
import com.ecr.ams.modules.asset.entity.Asset;
import com.ecr.ams.modules.asset.repository.AssetRepository;
import com.ecr.ams.modules.publicaccess.dto.PublicAssetResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/assets/public")
@RequiredArgsConstructor
public class PublicAssetController {

    private final AssetRepository assetRepository;

    @GetMapping("/{assetId}")
    public ResponseEntity<ApiResponse<PublicAssetResponse>> getPublicAssetById(@PathVariable String assetId) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found"));

        return ResponseEntity.ok(ApiResponse.success("Asset details retrieved successfully", PublicAssetResponse.fromEntity(asset)));
    }
}
