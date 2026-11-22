package com.ecr.ams.modules.employee.controller;

import com.ecr.ams.modules.employee.dto.EmployeeRequest;
import com.ecr.ams.modules.employee.dto.EmployeeResponse;
import com.ecr.ams.modules.employee.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @PostMapping
    public ResponseEntity<Map<String, Object>> createEmployee(@Valid @RequestBody EmployeeRequest request) {
        EmployeeResponse response = employeeService.createEmployee(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(buildSuccessResponse("Employee created successfully", response));
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllEmployees(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<EmployeeResponse> employees = employeeService.getAllEmployees(keyword, pageable);
        
        Map<String, Object> data = new HashMap<>();
        data.put("content", employees.getContent());
        data.put("totalElements", employees.getTotalElements());
        data.put("totalPages", employees.getTotalPages());
        data.put("currentPage", employees.getNumber());
        
        return ResponseEntity.ok(buildSuccessResponse("Employees retrieved successfully", data));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getEmployeeById(@PathVariable String id) {
        EmployeeResponse response = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(buildSuccessResponse("Employee retrieved successfully", response));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateEmployee(@PathVariable String id, @Valid @RequestBody EmployeeRequest request) {
        EmployeeResponse response = employeeService.updateEmployee(id, request);
        return ResponseEntity.ok(buildSuccessResponse("Employee updated successfully", response));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteEmployee(@PathVariable String id) {
        employeeService.softDeleteEmployee(id);
        return ResponseEntity.ok(buildSuccessResponse("Employee deleted successfully", null));
    }

    private Map<String, Object> buildSuccessResponse(String message, Object data) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", message);
        response.put("data", data);
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return response;
    }
}
