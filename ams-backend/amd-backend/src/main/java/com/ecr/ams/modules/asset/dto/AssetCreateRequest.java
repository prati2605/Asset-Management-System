package com.ecr.ams.modules.asset.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class AssetCreateRequest {
    @NotBlank(message = "Asset Name is mandatory")
    private String name;

    @NotBlank(message = "Asset Type is mandatory")
    private String assetType;

    @NotBlank(message = "Serial Number is mandatory")
    private String serialNumber;

    @NotNull(message = "Purchase Date is mandatory")
    private LocalDate purchaseDate;

    @NotNull(message = "Purchase Cost is mandatory")
    @DecimalMin(value = "0.0", message = "Cost must be positive")
    private BigDecimal purchaseCost;

    private String vendorId;
}
