package com.ecr.ams.modules.maintenance.entity;

import com.ecr.ams.common.BaseEntity;
import com.ecr.ams.modules.asset.entity.Asset;
import com.ecr.ams.modules.maintenance.enums.MaintenancePriority;
import com.ecr.ams.modules.maintenance.enums.MaintenanceStatus;
import com.ecr.ams.modules.vendor.entity.Vendor;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "maintenance_tickets")
@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE maintenance_tickets SET is_deleted = true, deleted_at = CURRENT_TIMESTAMP WHERE id=?")
@Where(clause = "is_deleted = false")
public class Maintenance extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @Column(name = "issue_description", columnDefinition = "TEXT")
    private String issueDescription;

    @Column(name = "reported_date")
    private LocalDate reportedDate;

    @Enumerated(EnumType.STRING)
    private MaintenancePriority priority;

    @Enumerated(EnumType.STRING)
    private MaintenanceStatus status;

    private String technician;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id")
    private Vendor vendor;

    @Column(name = "repair_cost")
    private BigDecimal repairCost;

    @Column(name = "completed_date")
    private LocalDate completedDate;

    @Column(columnDefinition = "TEXT")
    private String remarks;
}
