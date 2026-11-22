package com.ecr.ams.modules.vendor.repository;

import com.ecr.ams.modules.vendor.entity.Vendor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, String> {
    
    Optional<Vendor> findByVendorCode(String vendorCode);
    
    boolean existsByVendorCode(String vendorCode);
    
    @Query("SELECT v FROM Vendor v WHERE " +
           "LOWER(v.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(v.companyName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(v.vendorCode) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Vendor> searchVendors(@Param("keyword") String keyword, Pageable pageable);
}
