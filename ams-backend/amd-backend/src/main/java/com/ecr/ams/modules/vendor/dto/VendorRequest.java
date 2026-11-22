package com.ecr.ams.modules.vendor.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorRequest {

    @NotBlank(message = "Vendor Code is required")
    private String vendorCode;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Company Name is required")
    private String companyName;

    @Email(message = "Invalid email format")
    private String email;

    private String phone;
    private String address;
}
