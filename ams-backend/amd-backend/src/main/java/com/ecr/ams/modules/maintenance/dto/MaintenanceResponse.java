package com.ecr.ams.modules.maintenance.dto;

import com.ecr.ams.modules.maintenance.entity.Maintenance;
import com.ecr.ams.modules.maintenance.enums.MaintenancePriority;
import com.ecr.ams.modules.maintenance.enums.MaintenanceStatus;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class MaintenanceResponse {
    private String id;
    private String assetId;
    private String assetName;
    private String issueDescription;
    private LocalDate reportedDate;
    private MaintenancePriority priority;
    private MaintenanceStatus status;
    private String technician;
    private String vendorId;
    private String vendorName;
    private BigDecimal repairCost;
    private LocalDate completedDate;
    private String remarks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static MaintenanceResponse fromEntity(Maintenance maintenance) {
        if (maintenance == null) return null;
        return MaintenanceResponse.builder()
                .id(maintenance.getId())
                .assetId(maintenance.getAsset() != null ? maintenance.getAsset().getId() : null)
                .assetName(maintenance.getAsset() != null ? maintenance.getAsset().getName() : null)
                .issueDescription(maintenance.getIssueDescription())
                .reportedDate(maintenance.getReportedDate())
                .priority(maintenance.getPriority())
                .status(maintenance.getStatus())
                .technician(maintenance.getTechnician())
                .vendorId(maintenance.getVendor() != null ? maintenance.getVendor().getId() : null)
                .vendorName(maintenance.getVendor() != null ? maintenance.getVendor().getName() : null)
                .repairCost(maintenance.getRepairCost())
                .completedDate(maintenance.getCompletedDate())
                .remarks(maintenance.getRemarks())
                .createdAt(maintenance.getCreatedAt())
                .updatedAt(maintenance.getUpdatedAt())
                .build();
    }
}
