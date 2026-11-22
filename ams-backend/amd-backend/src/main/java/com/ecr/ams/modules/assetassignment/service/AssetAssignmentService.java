package com.ecr.ams.modules.assetassignment.service;

import com.ecr.ams.modules.asset.entity.Asset;
import com.ecr.ams.modules.asset.enums.AssetStatus;
import com.ecr.ams.modules.asset.repository.AssetRepository;
import com.ecr.ams.modules.employee.entity.Employee;
import com.ecr.ams.modules.employee.repository.EmployeeRepository;
import com.ecr.ams.modules.assetassignment.dto.AssetAssignmentResponse;
import com.ecr.ams.modules.assetassignment.entity.AssetAssignment;
import com.ecr.ams.modules.assetassignment.enums.AssignmentStatus;
import com.ecr.ams.modules.assetassignment.exception.AssetAssignmentException;
import com.ecr.ams.modules.assetassignment.repository.AssetAssignmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List; import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class AssetAssignmentService {
    private final AssetAssignmentRepository assignmentRepository;
    private final AssetRepository assetRepository;
    private final EmployeeRepository employeeRepository;

    @Transactional
    public AssetAssignmentResponse assignAsset(String assetId, String employeeId) {
        Asset asset = assetRepository.findById(assetId).orElseThrow(() -> new AssetAssignmentException("Asset not found"));
        if (asset.getIsDeleted()) throw new AssetAssignmentException("Cannot assign a deleted asset");

        // Rule 1: Only one ACTIVE assignment per asset
        if (assignmentRepository.existsByAssetIdAndStatus(assetId, AssignmentStatus.ACTIVE))
            throw new AssetAssignmentException("Asset is already actively assigned");

        Employee emp = employeeRepository.findById(employeeId).orElseThrow(() -> new AssetAssignmentException("Employee not found"));
        if (emp.getIsDeleted()) throw new AssetAssignmentException("Cannot assign to a deleted employee");

        // Rule 3: Employee cannot have two active laptops
        if ("IT Equipment".equalsIgnoreCase(asset.getAssetType())) {
            if (assignmentRepository.countActiveLaptopsByEmployeeId(employeeId) >= 1)
                throw new AssetAssignmentException("Employee already has an active laptop assigned");
        }

        // Rule 4: Maintain history
        AssetAssignment assignment = AssetAssignment.builder()
                .asset(asset).employee(emp).assignedDate(LocalDateTime.now()).status(AssignmentStatus.ACTIVE).build();
        assignmentRepository.save(assignment);

        // Rule 2: Auto status change
        asset.setStatus(AssetStatus.IN_USE);
        assetRepository.save(asset);

        return AssetAssignmentResponse.fromEntity(assignment);
    }

    @Transactional
    public AssetAssignmentResponse returnAsset(String assetId) {
        AssetAssignment assignment = assignmentRepository.findByAssetIdAndStatus(assetId, AssignmentStatus.ACTIVE)
                .orElseThrow(() -> new AssetAssignmentException("No active assignment found for this asset"));

        assignment.setReturnedDate(LocalDateTime.now());
        assignment.setStatus(AssignmentStatus.RETURNED);
        assignmentRepository.save(assignment);

        // Rule 2: Auto status change
        Asset asset = assignment.getAsset();
        asset.setStatus(AssetStatus.AVAILABLE);
        assetRepository.save(asset);

        return AssetAssignmentResponse.fromEntity(assignment);
    }

    @Transactional(readOnly = true)
    public List<AssetAssignmentResponse> getAssetHistory(String assetId) {
        if (!assetRepository.existsById(assetId)) throw new AssetAssignmentException("Asset not found");
        return assignmentRepository.findByAssetIdOrderByAssignedDateDesc(assetId).stream().map(AssetAssignmentResponse::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AssetAssignmentResponse> getEmployeeAssets(String employeeId) {
        if (!employeeRepository.existsById(employeeId)) throw new AssetAssignmentException("Employee not found");
        return assignmentRepository.findByEmployeeIdOrderByAssignedDateDesc(employeeId).stream().map(AssetAssignmentResponse::fromEntity).collect(Collectors.toList());
    }
}