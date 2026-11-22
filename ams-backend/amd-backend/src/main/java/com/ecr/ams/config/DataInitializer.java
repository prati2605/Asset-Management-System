package com.ecr.ams.config;

import com.ecr.ams.modules.asset.entity.Asset;
import com.ecr.ams.modules.asset.enums.AssetStatus;
import com.ecr.ams.modules.asset.repository.AssetRepository;
import com.ecr.ams.modules.employee.entity.Employee;
import com.ecr.ams.modules.employee.enums.EmployeeStatus;
import com.ecr.ams.modules.employee.repository.EmployeeRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Component
@Profile("dev")
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final AssetRepository assetRepository;
    private final EmployeeRepository employeeRepository;
    private final ObjectMapper objectMapper;

    @Override
    public void run(String... args) throws Exception {
        // --- ASSET INITIALIZATION ---
        if (assetRepository.count() == 0) {
            log.info("=== STARTING DEMO DATA INITIALIZATION (ASSETS) ===");
            try {
                InputStream inputStream = new ClassPathResource("demo-data/assets.json").getInputStream();
                List<Map<String, Object>> assetMaps = objectMapper.readValue(
                        inputStream,
                        objectMapper.getTypeFactory().constructCollectionType(List.class, Map.class)
                );

                List<Asset> assetsToSave = assetMaps.stream()
                        .map(this::mapToAsset)
                        .filter(asset -> asset != null)
                        .toList();

                assetRepository.saveAll(assetsToSave);
                log.info("=== SUCCESSFULLY LOADED {} ASSETS ===", assetsToSave.size());
            } catch (Exception e) {
                log.error("Failed to initialize asset demo data", e);
            }
        } else {
            log.info("Database already contains assets. Skipping asset initialization.");
        }

        // --- EMPLOYEE INITIALIZATION ---
        if (employeeRepository.count() == 0) {
            log.info("=== STARTING EMPLOYEE DEMO DATA INITIALIZATION ===");
            try {
                List<Employee> employees = List.of(
                        Employee.builder().employeeCode("EMP001").name("Rajesh Kumar").email("rajesh@railway.com").phone("9876543210").department("IT").designation("Manager").location("Bhubaneswar").status(EmployeeStatus.ACTIVE).isDeleted(false).build(),
                        Employee.builder().employeeCode("EMP002").name("Priya Sharma").email("priya@railway.com").phone("9876543211").department("Operations").designation("Engineer").location("Visakhapatnam").status(EmployeeStatus.ACTIVE).isDeleted(false).build(),
                        Employee.builder().employeeCode("EMP003").name("Amit Patel").email("amit@railway.com").phone("9876543212").department("Mechanical").designation("Technician").location("Khurda Road").status(EmployeeStatus.ON_LEAVE).isDeleted(false).build(),
                        Employee.builder().employeeCode("EMP004").name("Sneha Reddy").email("sneha@railway.com").phone("9876543213").department("Electrical").designation("Senior Engineer").location("Bhubaneswar").status(EmployeeStatus.ACTIVE).isDeleted(false).build(),
                        Employee.builder().employeeCode("EMP005").name("Vikram Singh").email("vikram@railway.com").phone("9876543214").department("Signal & Telecom").designation("Supervisor").location("Visakhapatnam").status(EmployeeStatus.INACTIVE).isDeleted(false).build()
                );
                employeeRepository.saveAll(employees);
                log.info("=== SUCCESSFULLY LOADED {} EMPLOYEES ===", employees.size());
            } catch (Exception e) {
                log.error("Failed to initialize employee demo data", e);
            }
        } else {
            log.info("Database already contains employees. Skipping employee initialization.");
        }
    }

    private Asset mapToAsset(Map<String, Object> map) {
        try {
            return Asset.builder()
                    .name((String) map.get("name"))
                    .assetType((String) map.get("assetType"))
                    .brand((String) map.get("brand"))
                    .model((String) map.get("model"))
                    .serialNumber((String) map.get("serialNumber"))
                    .purchaseDate(parseDate(map.get("purchaseDate")))
                    .purchaseCost(parseCost(map.get("purchaseCost")))
                    .status(parseStatus((String) map.get("status")))
                    .department((String) map.get("department"))
                    .location((String) map.get("location"))
                    .warrantyExpiry(parseDate(map.get("warrantyExpiry")))
                    .isDeleted(false)
                    .build();
        } catch (Exception e) {
            log.warn("Skipping invalid asset record: {}", map.get("name"));
            return null;
        }
    }

    private AssetStatus parseStatus(String statusStr) {
        if (statusStr == null || statusStr.isEmpty()) {
            return AssetStatus.AVAILABLE;
        }
        try {
            return AssetStatus.valueOf(statusStr);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid status '{}', defaulting to AVAILABLE", statusStr);
            return AssetStatus.AVAILABLE;
        }
    }

    private LocalDate parseDate(Object dateObj) {
        if (dateObj == null) return null;
        try {
            return LocalDate.parse(dateObj.toString());
        } catch (Exception e) {
            return null;
        }
    }

    private BigDecimal parseCost(Object costObj) {
        if (costObj == null) return BigDecimal.ZERO;
        try {
            if (costObj instanceof Integer) {
                return BigDecimal.valueOf((Integer) costObj);
            } else if (costObj instanceof Double) {
                return BigDecimal.valueOf((Double) costObj);
            }
            return new BigDecimal(costObj.toString());
        } catch (Exception e) {
            return BigDecimal.ZERO;
        }
    }
}
