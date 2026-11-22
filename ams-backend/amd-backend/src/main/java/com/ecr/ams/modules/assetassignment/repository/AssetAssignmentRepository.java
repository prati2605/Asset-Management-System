package com.ecr.ams.modules.assetassignment.repository;

import com.ecr.ams.modules.assetassignment.entity.AssetAssignment;
import com.ecr.ams.modules.assetassignment.enums.AssignmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List; import java.util.Optional;

@Repository
public interface AssetAssignmentRepository extends JpaRepository<AssetAssignment, String> {
    boolean existsByAssetIdAndStatus(String assetId, AssignmentStatus status);
    Optional<AssetAssignment> findByAssetIdAndStatus(String assetId, AssignmentStatus status);
    List<AssetAssignment> findByAssetIdOrderByAssignedDateDesc(String assetId);
    List<AssetAssignment> findByEmployeeIdOrderByAssignedDateDesc(String employeeId);
    
    // Rule 3: Count active laptops (IT Equipment) for an employee
    @Query("SELECT COUNT(a) FROM AssetAssignment a WHERE a.employee.id = :empId AND a.status = 'ACTIVE' AND a.asset.assetType = 'IT Equipment'")
    long countActiveLaptopsByEmployeeId(@Param("empId") String empId);
}