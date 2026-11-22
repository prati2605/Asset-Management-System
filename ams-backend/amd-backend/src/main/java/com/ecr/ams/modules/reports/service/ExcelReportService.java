package com.ecr.ams.modules.reports.service;

import com.ecr.ams.modules.asset.entity.Asset;
import com.ecr.ams.modules.asset.repository.AssetRepository;
import com.ecr.ams.modules.employee.entity.Employee;
import com.ecr.ams.modules.employee.repository.EmployeeRepository;
import com.ecr.ams.modules.maintenance.entity.Maintenance;
import com.ecr.ams.modules.maintenance.repository.MaintenanceRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExcelReportService {

    private final AssetRepository assetRepository;
    private final EmployeeRepository employeeRepository;
    private final MaintenanceRepository maintenanceRepository;

    public byte[] generateAssetsReport() throws IOException {
        List<Asset> assets = assetRepository.findAll();
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Assets");
            
            // Header Row
            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID", "Name", "Type", "Brand", "Model", "Serial Number", "Purchase Date", "Cost (INR)", "Status", "Department", "Location"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            // Data Rows
            int rowIdx = 1;
            for (Asset asset : assets) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(asset.getId());
                row.createCell(1).setCellValue(asset.getName());
                row.createCell(2).setCellValue(asset.getAssetType());
                row.createCell(3).setCellValue(asset.getBrand() != null ? asset.getBrand() : "");
                row.createCell(4).setCellValue(asset.getModel() != null ? asset.getModel() : "");
                row.createCell(5).setCellValue(asset.getSerialNumber());
                row.createCell(6).setCellValue(asset.getPurchaseDate() != null ? asset.getPurchaseDate().toString() : "");
                row.createCell(7).setCellValue(asset.getPurchaseCost() != null ? asset.getPurchaseCost().doubleValue() : 0.0);
                row.createCell(8).setCellValue(asset.getStatus() != null ? asset.getStatus().name() : "");
                row.createCell(9).setCellValue(asset.getDepartment() != null ? asset.getDepartment() : "");
                row.createCell(10).setCellValue(asset.getLocation() != null ? asset.getLocation() : "");
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }

    public byte[] generateEmployeesReport() throws IOException {
        List<Employee> employees = employeeRepository.findAll();
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Employees");
            
            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID", "Code", "Name", "Email", "Department", "Designation", "Phone", "Status"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            int rowIdx = 1;
            for (Employee emp : employees) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(emp.getId());
                row.createCell(1).setCellValue(emp.getEmployeeCode());
                row.createCell(2).setCellValue(emp.getName());
                row.createCell(3).setCellValue(emp.getEmail());
                row.createCell(4).setCellValue(emp.getDepartment() != null ? emp.getDepartment() : "");
                row.createCell(5).setCellValue(emp.getDesignation() != null ? emp.getDesignation() : "");
                row.createCell(6).setCellValue(emp.getPhone() != null ? emp.getPhone() : "");
                row.createCell(7).setCellValue(emp.getStatus() != null ? emp.getStatus().name() : "");
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }

    public byte[] generateMaintenanceReport() throws IOException {
        List<Maintenance> tickets = maintenanceRepository.findAll();
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Maintenance");
            
            Row headerRow = sheet.createRow(0);
            String[] headers = {"Ticket ID", "Asset Name", "Serial Number", "Issue", "Reported Date", "Priority", "Status", "Technician", "Cost", "Completed Date"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            int rowIdx = 1;
            for (Maintenance t : tickets) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(t.getId());
                row.createCell(1).setCellValue(t.getAsset() != null ? t.getAsset().getName() : "");
                row.createCell(2).setCellValue(t.getAsset() != null ? t.getAsset().getSerialNumber() : "");
                row.createCell(3).setCellValue(t.getIssueDescription());
                row.createCell(4).setCellValue(t.getReportedDate() != null ? t.getReportedDate().toString() : "");
                row.createCell(5).setCellValue(t.getPriority() != null ? t.getPriority().name() : "");
                row.createCell(6).setCellValue(t.getStatus() != null ? t.getStatus().name() : "");
                row.createCell(7).setCellValue(t.getTechnician() != null ? t.getTechnician() : "");
                row.createCell(8).setCellValue(t.getRepairCost() != null ? t.getRepairCost().doubleValue() : 0.0);
                row.createCell(9).setCellValue(t.getCompletedDate() != null ? t.getCompletedDate().toString() : "");
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }
}
