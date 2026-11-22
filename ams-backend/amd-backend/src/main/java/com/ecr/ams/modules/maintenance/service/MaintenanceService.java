package com.ecr.ams.modules.maintenance.service;

import com.ecr.ams.exception.ResourceNotFoundException;
import com.ecr.ams.modules.asset.entity.Asset;
import com.ecr.ams.modules.asset.enums.AssetStatus;
import com.ecr.ams.modules.asset.repository.AssetRepository;
import com.ecr.ams.modules.maintenance.dto.MaintenanceRequest;
import com.ecr.ams.modules.maintenance.dto.MaintenanceResponse;
import com.ecr.ams.modules.maintenance.entity.Maintenance;
import com.ecr.ams.modules.maintenance.enums.MaintenancePriority;
import com.ecr.ams.modules.maintenance.enums.MaintenanceStatus;
import com.ecr.ams.modules.maintenance.repository.MaintenanceRepository;
import com.ecr.ams.modules.vendor.entity.Vendor;
import com.ecr.ams.modules.vendor.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class MaintenanceService {
    private final MaintenanceRepository maintenanceRepository;
    private final AssetRepository assetRepository;
    private final VendorRepository vendorRepository;

    @Transactional
    public MaintenanceResponse createMaintenance(MaintenanceRequest request) {
        Asset asset = assetRepository.findById(request.getAssetId())
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found"));

        if (asset.getStatus() == AssetStatus.UNDER_REPAIR) {
            throw new IllegalArgumentException("Asset is already under repair");
        }
        if (asset.getStatus() == AssetStatus.DISPOSED) {
            throw new IllegalArgumentException("Cannot create maintenance for a disposed asset");
        }

        // Change asset status
        asset.setStatus(AssetStatus.UNDER_REPAIR);
        assetRepository.save(asset);

        Maintenance maintenance = Maintenance.builder()
                .asset(asset)
                .issueDescription(request.getIssueDescription())
                .reportedDate(request.getReportedDate())
                .priority(request.getPriority())
                .status(request.getStatus() != null ? request.getStatus() : MaintenanceStatus.OPEN)
                .technician(request.getTechnician())
                .repairCost(request.getRepairCost())
                .completedDate(request.getCompletedDate())
                .remarks(request.getRemarks())
                .build();

        if (request.getVendorId() != null && !request.getVendorId().isEmpty()) {
            Vendor vendor = vendorRepository.findById(request.getVendorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Vendor not found"));
            maintenance.setVendor(vendor);
        }

        maintenance = maintenanceRepository.save(maintenance);
        return MaintenanceResponse.fromEntity(maintenance);
    }

    @Transactional(readOnly = true)
    public Page<MaintenanceResponse> getMaintenanceTickets(MaintenanceStatus status, MaintenancePriority priority, String assetId, String vendorId, Pageable pageable) {
        return maintenanceRepository.search(status, priority, assetId, vendorId, pageable)
                .map(MaintenanceResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public MaintenanceResponse getMaintenanceById(String id) {
        Maintenance maintenance = maintenanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance ticket not found"));
        return MaintenanceResponse.fromEntity(maintenance);
    }

    @Transactional
    public MaintenanceResponse updateMaintenance(String id, MaintenanceRequest request) {
        Maintenance maintenance = maintenanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance ticket not found"));

        // Validation for completion
        if (request.getStatus() == MaintenanceStatus.COMPLETED) {
            if (request.getRepairCost() == null) {
                throw new IllegalArgumentException("Repair cost is required to complete maintenance");
            }
            if (request.getCompletedDate() == null) {
                request.setCompletedDate(LocalDate.now());
            }
            
            // Revert asset status to AVAILABLE
            Asset asset = maintenance.getAsset();
            asset.setStatus(AssetStatus.AVAILABLE);
            assetRepository.save(asset);
        }

        maintenance.setIssueDescription(request.getIssueDescription());
        maintenance.setReportedDate(request.getReportedDate());
        maintenance.setPriority(request.getPriority());
        maintenance.setStatus(request.getStatus());
        maintenance.setTechnician(request.getTechnician());
        maintenance.setRepairCost(request.getRepairCost());
        maintenance.setCompletedDate(request.getCompletedDate());
        maintenance.setRemarks(request.getRemarks());

        if (request.getVendorId() != null && !request.getVendorId().isEmpty()) {
            Vendor vendor = vendorRepository.findById(request.getVendorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Vendor not found"));
            maintenance.setVendor(vendor);
        } else {
            maintenance.setVendor(null);
        }

        maintenance = maintenanceRepository.save(maintenance);
        return MaintenanceResponse.fromEntity(maintenance);
    }

    @Transactional
    public void deleteMaintenance(String id) {
        Maintenance maintenance = maintenanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance ticket not found"));

        if (maintenance.getStatus() != MaintenanceStatus.OPEN) {
            throw new IllegalArgumentException("Only OPEN maintenance tickets can be deleted");
        }

        // If deleting the ticket, and the asset is UNDER_REPAIR, maybe we should set it back to what it was? 
        // For simplicity and following requirements, just deleting the ticket.
        Asset asset = maintenance.getAsset();
        if (asset.getStatus() == AssetStatus.UNDER_REPAIR) {
            asset.setStatus(AssetStatus.AVAILABLE);
            assetRepository.save(asset);
        }

        maintenanceRepository.delete(maintenance);
    }
}
