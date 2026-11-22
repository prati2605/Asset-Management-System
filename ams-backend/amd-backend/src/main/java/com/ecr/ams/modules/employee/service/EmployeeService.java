package com.ecr.ams.modules.employee.service;

import com.ecr.ams.modules.employee.dto.EmployeeRequest;
import com.ecr.ams.modules.employee.dto.EmployeeResponse;
import com.ecr.ams.modules.employee.entity.Employee;
import com.ecr.ams.modules.employee.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Transactional
    public EmployeeResponse createEmployee(EmployeeRequest request) {
        if (employeeRepository.existsByEmployeeCode(request.getEmployeeCode())) {
            throw new RuntimeException("Employee code already exists: " + request.getEmployeeCode());
        }
        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }

        Employee employee = Employee.builder()
                .employeeCode(request.getEmployeeCode())
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .department(request.getDepartment())
                .designation(request.getDesignation())
                .location(request.getLocation())
                .status(request.getStatus())
                .isDeleted(false)
                .build();

        return EmployeeResponse.fromEntity(employeeRepository.save(employee));
    }

    @Transactional(readOnly = true)
    public Page<EmployeeResponse> getAllEmployees(String keyword, Pageable pageable) {
        Page<Employee> employees;
        if (keyword != null && !keyword.trim().isEmpty()) {
            employees = employeeRepository.searchEmployees(keyword, pageable);
        } else {
            employees = employeeRepository.findAll(pageable);
        }
        return employees.map(EmployeeResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public EmployeeResponse getEmployeeById(String id) {
        Employee employee = employeeRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        return EmployeeResponse.fromEntity(employee);
    }

    @Transactional
    public EmployeeResponse updateEmployee(String id, EmployeeRequest request) {
        Employee employee = employeeRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));

        // Check uniqueness if changed
        if (!employee.getEmployeeCode().equals(request.getEmployeeCode()) && 
            employeeRepository.existsByEmployeeCode(request.getEmployeeCode())) {
            throw new RuntimeException("Employee code already exists");
        }
        if (!employee.getEmail().equals(request.getEmail()) && 
            employeeRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        employee.setEmployeeCode(request.getEmployeeCode());
        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setDepartment(request.getDepartment());
        employee.setDesignation(request.getDesignation());
        employee.setLocation(request.getLocation());
        employee.setStatus(request.getStatus());

        return EmployeeResponse.fromEntity(employeeRepository.save(employee));
    }

    @Transactional
    public void softDeleteEmployee(String id) {
        Employee employee = employeeRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        employee.setIsDeleted(true);
        employeeRepository.save(employee);
    }
}
