package com.ecr.ams.modules.reports.controller;

import com.ecr.ams.modules.reports.service.ExcelReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ExcelReportService excelReportService;

    @GetMapping("/assets")
    public ResponseEntity<byte[]> downloadAssetsReport() throws IOException {
        byte[] excelContent = excelReportService.generateAssetsReport();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", "Assets_Report.xlsx");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return ResponseEntity.ok()
                .headers(headers)
                .body(excelContent);
    }

    @GetMapping("/employees")
    public ResponseEntity<byte[]> downloadEmployeesReport() throws IOException {
        byte[] excelContent = excelReportService.generateEmployeesReport();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", "Employees_Report.xlsx");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return ResponseEntity.ok()
                .headers(headers)
                .body(excelContent);
    }

    @GetMapping("/maintenance")
    public ResponseEntity<byte[]> downloadMaintenanceReport() throws IOException {
        byte[] excelContent = excelReportService.generateMaintenanceReport();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", "Maintenance_Report.xlsx");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return ResponseEntity.ok()
                .headers(headers)
                .body(excelContent);
    }
}
