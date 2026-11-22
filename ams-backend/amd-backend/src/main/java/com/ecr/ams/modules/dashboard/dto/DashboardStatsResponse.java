package com.ecr.ams.modules.dashboard.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
public class DashboardStatsResponse {
    private long totalAssets;
    private long totalEmployees;
    private BigDecimal totalAssetValue;
    private long availableAssets;
    private long assignedAssets;
    private long maintenanceAssets;
    private long retiredAssets;
    private Map<String, Long> assetsByType;
    private Map<String, Long> assetsByDepartment;
}
