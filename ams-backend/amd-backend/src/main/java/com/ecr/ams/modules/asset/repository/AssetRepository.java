package com.ecr.ams.modules.asset.repository;

import org.springframework.data.repository.query.Param;

import org.springframework.data.jpa.repository.Query;
import com.ecr.ams.modules.asset.entity.Asset;
import com.ecr.ams.modules.asset.enums.AssetStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AssetRepository extends JpaRepository<Asset, String>, JpaSpecificationExecutor<Asset> {
    Optional<Asset> findByQrCode(String qrCode);
    boolean existsBySerialNumber(String serialNumber);
    Page<Asset> findByStatus(AssetStatus status, Pageable pageable);
    Page<Asset> findByVendorId(String vendorId, Pageable pageable);
    Page<Asset> findByStatusAndVendorId(AssetStatus status, String vendorId, Pageable pageable);

    @Query("SELECT a FROM Asset a WHERE a.isDeleted = false AND a.warrantyExpiry IS NOT NULL AND a.warrantyExpiry <= :date AND a.warrantyExpiry >= CURRENT_DATE ORDER BY a.warrantyExpiry ASC")
    java.util.List<Asset> findAssetsWithWarrantyExpiringBefore(@Param("date") java.time.LocalDate date);

    @Query("SELECT COUNT(a) FROM Asset a WHERE a.isDeleted = false")
    long countActiveAssets();

    @Query("SELECT COALESCE(SUM(a.purchaseCost), 0) FROM Asset a WHERE a.isDeleted = false")
    java.math.BigDecimal sumTotalAssetValue();

    @Query("SELECT COUNT(a) FROM Asset a WHERE a.isDeleted = false AND a.status = :status")
    long countByStatus(@Param("status") com.ecr.ams.modules.asset.enums.AssetStatus status);

    @Query("SELECT a.assetType, COUNT(a) FROM Asset a WHERE a.isDeleted = false GROUP BY a.assetType")
    java.util.List<Object[]> countGroupedByType();

    @Query("SELECT a.department, COUNT(a) FROM Asset a WHERE a.isDeleted = false GROUP BY a.department")
    java.util.List<Object[]> countGroupedByDepartment();

}
