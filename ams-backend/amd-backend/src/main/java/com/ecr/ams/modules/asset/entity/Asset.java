package com.ecr.ams.modules.asset.entity;

import com.ecr.ams.modules.asset.enums.AssetStatus;
import com.ecr.ams.modules.vendor.entity.Vendor;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "assets")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name;
    
    @Column(name = "asset_type")
    private String assetType;

    private String brand;
    private String model;

    @Column(name = "serial_number", unique = true)
    private String serialNumber;

    @Column(name = "purchase_date")
    private LocalDate purchaseDate;

    @Column(name = "purchase_cost")
    private BigDecimal purchaseCost;

    @Enumerated(EnumType.STRING)
    private AssetStatus status;

    private String department;
    private String location;

    @Column(name = "warranty_expiry")
    private LocalDate warrantyExpiry;

    @Column(name = "qr_code", unique = true)
    private String qrCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id")
    private Vendor vendor;

    @Column(name = "is_deleted")
    @Builder.Default
    private Boolean isDeleted = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.qrCode == null || this.qrCode.isEmpty()) {
            this.qrCode = "AMS-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
