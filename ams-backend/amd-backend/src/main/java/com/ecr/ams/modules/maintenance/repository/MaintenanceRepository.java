package com.ecr.ams.modules.maintenance.repository;

import com.ecr.ams.modules.maintenance.entity.Maintenance;
import com.ecr.ams.modules.maintenance.enums.MaintenancePriority;
import com.ecr.ams.modules.maintenance.enums.MaintenanceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MaintenanceRepository extends JpaRepository<Maintenance, String> {

    @Query("SELECT m FROM Maintenance m " +
           "WHERE (:status IS NULL OR m.status = :status) " +
           "AND (:priority IS NULL OR m.priority = :priority) " +
           "AND (:assetId IS NULL OR m.asset.id = :assetId) " +
           "AND (:vendorId IS NULL OR m.vendor.id = :vendorId)")
    Page<Maintenance> search(
            @Param("status") MaintenanceStatus status,
            @Param("priority") MaintenancePriority priority,
            @Param("assetId") String assetId,
            @Param("vendorId") String vendorId,
            Pageable pageable);

}
