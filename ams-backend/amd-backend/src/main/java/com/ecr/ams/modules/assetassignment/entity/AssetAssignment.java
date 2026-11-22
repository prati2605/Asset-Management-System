package com.ecr.ams.modules.assetassignment.entity;

import com.ecr.ams.modules.asset.entity.Asset;
import com.ecr.ams.modules.employee.entity.Employee;
import com.ecr.ams.modules.assetassignment.enums.AssignmentStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "asset_assignments")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AssetAssignment {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "assigned_date", nullable = false)
    private LocalDateTime assignedDate;

    @Column(name = "returned_date")
    private LocalDateTime returnedDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssignmentStatus status;
}