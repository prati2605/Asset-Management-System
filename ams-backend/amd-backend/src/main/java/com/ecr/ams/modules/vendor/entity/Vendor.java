package com.ecr.ams.modules.vendor.entity;

import com.ecr.ams.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Where;

@Entity
@Table(name = "vendors")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@Where(clause = "is_deleted = false")
public class Vendor extends BaseEntity {

    @Column(name = "vendor_code", unique = true, nullable = false, length = 50)
    private String vendorCode;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "company_name", nullable = false, length = 100)
    private String companyName;

    @Column(length = 100)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(columnDefinition = "TEXT")
    private String address;

}
