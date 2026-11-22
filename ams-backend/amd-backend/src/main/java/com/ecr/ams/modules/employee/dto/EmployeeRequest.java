package com.ecr.ams.modules.employee.dto;

import com.ecr.ams.modules.employee.enums.EmployeeStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EmployeeRequest {
    
    @NotBlank(message = "Employee code is required")
    private String employeeCode;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String phone;
    private String department;
    private String designation;
    private String location;

    @NotNull(message = "Status is required")
    private EmployeeStatus status;
}
