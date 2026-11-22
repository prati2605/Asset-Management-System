package com.ecr.ams.modules.employee.dto;

import com.ecr.ams.modules.employee.entity.Employee;
import com.ecr.ams.modules.employee.enums.EmployeeStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class EmployeeResponse {
    private String id;
    private String employeeCode;
    private String name;
    private String email;
    private String phone;
    private String department;
    private String designation;
    private String location;
    private EmployeeStatus status;
    private LocalDateTime createdAt;

    public static EmployeeResponse fromEntity(Employee employee) {
        return EmployeeResponse.builder()
                .id(employee.getId())
                .employeeCode(employee.getEmployeeCode())
                .name(employee.getName())
                .email(employee.getEmail())
                .phone(employee.getPhone())
                .department(employee.getDepartment())
                .designation(employee.getDesignation())
                .location(employee.getLocation())
                .status(employee.getStatus())
                .createdAt(employee.getCreatedAt())
                .build();
    }
}
