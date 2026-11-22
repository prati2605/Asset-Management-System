package com.ecr.ams.modules.vendor.service;

import com.ecr.ams.common.dto.ApiResponse;
import com.ecr.ams.modules.vendor.dto.VendorRequest;
import com.ecr.ams.modules.vendor.dto.VendorResponse;
import com.ecr.ams.modules.vendor.entity.Vendor;
import com.ecr.ams.modules.vendor.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VendorService {

    private final VendorRepository vendorRepository;

    @Transactional
    public ApiResponse<VendorResponse> createVendor(VendorRequest request) {
        if (vendorRepository.existsByVendorCode(request.getVendorCode())) {
            return ApiResponse.error("Vendor with code " + request.getVendorCode() + " already exists", null);
        }

        Vendor vendor = Vendor.builder()
                .vendorCode(request.getVendorCode())
                .name(request.getName())
                .companyName(request.getCompanyName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .build();

        Vendor saved = vendorRepository.save(vendor);
        return ApiResponse.success("Vendor created successfully", mapToResponse(saved));
    }

    public ApiResponse<Page<VendorResponse>> getAllVendors(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Vendor> vendors = (keyword != null && !keyword.trim().isEmpty())
                ? vendorRepository.searchVendors(keyword.trim(), pageable)
                : vendorRepository.findAll(pageable);
        
        return ApiResponse.success("Vendors retrieved", vendors.map(this::mapToResponse));
    }

    public ApiResponse<VendorResponse> getVendorById(String id) {
        Optional<Vendor> vendorOpt = vendorRepository.findById(id);
        if (vendorOpt.isEmpty() || vendorOpt.get().isDeleted()) {
            return ApiResponse.error("Vendor not found", null);
        }
        return ApiResponse.success("Vendor retrieved", mapToResponse(vendorOpt.get()));
    }

    @Transactional
    public ApiResponse<VendorResponse> updateVendor(String id, VendorRequest request) {
        Optional<Vendor> vendorOpt = vendorRepository.findById(id);
        if (vendorOpt.isEmpty() || vendorOpt.get().isDeleted()) {
            return ApiResponse.error("Vendor not found", null);
        }

        Vendor vendor = vendorOpt.get();

        if (!vendor.getVendorCode().equals(request.getVendorCode()) &&
            vendorRepository.existsByVendorCode(request.getVendorCode())) {
            return ApiResponse.error("Vendor code already in use", null);
        }

        vendor.setVendorCode(request.getVendorCode());
        vendor.setName(request.getName());
        vendor.setCompanyName(request.getCompanyName());
        vendor.setEmail(request.getEmail());
        vendor.setPhone(request.getPhone());
        vendor.setAddress(request.getAddress());

        Vendor updated = vendorRepository.save(vendor);
        return ApiResponse.success("Vendor updated successfully", mapToResponse(updated));
    }

    @Transactional
    public ApiResponse<Void> deleteVendor(String id) {
        Optional<Vendor> vendorOpt = vendorRepository.findById(id);
        if (vendorOpt.isEmpty() || vendorOpt.get().isDeleted()) {
            return ApiResponse.error("Vendor not found", null);
        }

        Vendor vendor = vendorOpt.get();
        vendor.setDeleted(true);
        vendor.setDeletedAt(LocalDateTime.now());
        vendorRepository.save(vendor);
        return ApiResponse.success("Vendor deleted successfully", null);
    }

    private VendorResponse mapToResponse(Vendor vendor) {
        return VendorResponse.builder()
                .id(vendor.getId())
                .vendorCode(vendor.getVendorCode())
                .name(vendor.getName())
                .companyName(vendor.getCompanyName())
                .email(vendor.getEmail())
                .phone(vendor.getPhone())
                .address(vendor.getAddress())
                .createdAt(vendor.getCreatedAt())
                .updatedAt(vendor.getUpdatedAt())
                .build();
    }
}
