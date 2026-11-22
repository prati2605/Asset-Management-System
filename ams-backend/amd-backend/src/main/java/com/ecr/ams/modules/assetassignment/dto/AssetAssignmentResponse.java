package com.ecr.ams.modules.assetassignment.dto;

import com.ecr.ams.modules.assetassignment.entity.AssetAssignment;
import com.ecr.ams.modules.assetassignment.enums.AssignmentStatus;
import lombok.Builder; import lombok.Data;
import java.time.LocalDateTime;

@Data @Builder
public class AssetAssignmentResponse {
    private String id;
    private String assetId;
    private String assetName;
    private String employeeId;
    private String employeeName;
    private String employeeCode;
    private LocalDateTime assignedDate;
    private LocalDateTime returnedDate;
    private AssignmentStatus status;

    public static AssetAssignmentResponse fromEntity(AssetAssignment a) {
        return AssetAssignmentResponse.builder()
                .id(a.getId()).assetId(a.getAsset().getId()).assetName(a.getAsset().getName())
                .employeeId(a.getEmployee().getId()).employeeName(a.getEmployee().getName()).employeeCode(a.getEmployee().getEmployeeCode())
                .assignedDate(a.getAssignedDate()).returnedDate(a.getReturnedDate()).status(a.getStatus()).build();
    }
}