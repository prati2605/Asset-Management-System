package com.ecr.ams.modules.publicaccess.dto;

import com.ecr.ams.modules.asset.entity.Asset;
import com.ecr.ams.modules.asset.enums.AssetStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PublicAssetResponse {
    private String id;
    private String name;
    private String assetType;
    private String brand;
    private String model;
    private String serialNumber;
    private AssetStatus status;
    private String department;
    private String location;

    public static PublicAssetResponse fromEntity(Asset asset) {
        if (asset == null) return null;
        return PublicAssetResponse.builder()
                .id(asset.getId())
                .name(asset.getName())
                .assetType(asset.getAssetType())
                .brand(asset.getBrand())
                .model(asset.getModel())
                .serialNumber(asset.getSerialNumber())
                .status(asset.getStatus())
                .department(asset.getDepartment())
                .location(asset.getLocation())
                .build();
    }
}
