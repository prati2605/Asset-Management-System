package com.ecr.ams.modules.asset.dto;

import com.ecr.ams.modules.asset.enums.AssetStatus;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssetResponse {
    private String id;
    private String name;
    private String assetType;
    private String brand;
    private String model;
    private String serialNumber;
    private LocalDate purchaseDate;
    private BigDecimal purchaseCost;
    private AssetStatus status;
    private String department;
    private String location;
    private LocalDate warrantyExpiry;
    private String qrCode;
    private LocalDateTime createdAt;
    private String vendorId;
    private String vendorName;
}
