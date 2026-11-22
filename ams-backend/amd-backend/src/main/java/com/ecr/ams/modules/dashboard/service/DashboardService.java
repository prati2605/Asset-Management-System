package com.ecr.ams.modules.dashboard.service;

import com.ecr.ams.modules.asset.enums.AssetStatus;
import com.ecr.ams.modules.asset.repository.AssetRepository;
import com.ecr.ams.modules.dashboard.dto.DashboardStatsResponse;
import com.ecr.ams.modules.employee.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final AssetRepository assetRepository;
    private final EmployeeRepository employeeRepository;

    public DashboardStatsResponse getStats() {
        long totalAssets = assetRepository.countActiveAssets();
        long totalEmployees = employeeRepository.count();
        BigDecimal totalValue = assetRepository.sumTotalAssetValue();

        long available = assetRepository.countByStatus(AssetStatus.AVAILABLE);
        long assigned = assetRepository.countByStatus(AssetStatus.IN_USE);
        long maintenance = assetRepository.countByStatus(AssetStatus.UNDER_REPAIR);
        long retired = assetRepository.countByStatus(AssetStatus.DISPOSED);

        Map<String, Long> byType = convertToMap(assetRepository.countGroupedByType());
        Map<String, Long> byDept = convertToMap(assetRepository.countGroupedByDepartment());

        return DashboardStatsResponse.builder()
                .totalAssets(totalAssets)
                .totalEmployees(totalEmployees)
                .totalAssetValue(totalValue != null ? totalValue : BigDecimal.ZERO)
                .availableAssets(available)
                .assignedAssets(assigned)
                .maintenanceAssets(maintenance)
                .retiredAssets(retired)
                .assetsByType(byType)
                .assetsByDepartment(byDept)
                .build();
    }

    private Map<String, Long> convertToMap(List<Object[]> results) {
        Map<String, Long> map = new HashMap<>();
        if (results != null) {
            for (Object[] row : results) {
                String key = row[0] != null ? row[0].toString() : "Unassigned";
                Long count = ((Number) row[1]).longValue();
                map.put(key, count);
            }
        }
        return map;
    }
}
