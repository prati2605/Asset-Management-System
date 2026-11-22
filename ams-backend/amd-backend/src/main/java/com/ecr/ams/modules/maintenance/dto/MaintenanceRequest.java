package com.ecr.ams.modules.maintenance.dto;

import com.ecr.ams.modules.maintenance.enums.MaintenancePriority;
import com.ecr.ams.modules.maintenance.enums.MaintenanceStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class MaintenanceRequest {
    @NotBlank(message = "Asset ID is required")
    private String assetId;

    @NotBlank(message = "Issue description is required")
    private String issueDescription;

    @NotNull(message = "Reported date is required")
    private LocalDate reportedDate;

    @NotNull(message = "Priority is required")
    private MaintenancePriority priority;

    @NotNull(message = "Status is required")
    private MaintenanceStatus status;

    private String technician;
    private String vendorId;
    private BigDecimal repairCost;
    private LocalDate completedDate;
    private String remarks;
}
