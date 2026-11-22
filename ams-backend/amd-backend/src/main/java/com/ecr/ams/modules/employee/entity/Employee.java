package com.ecr.ams.modules.employee.entity;

import com.ecr.ams.modules.employee.enums.EmployeeStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLRestriction;
import java.time.LocalDateTime;

@Entity
@Table(name = "employees")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLRestriction("is_deleted = false") // Hibernate 6 soft delete filter
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "employee_code", unique = true, nullable = false)
    private String employeeCode;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;
    private String department;
    private String designation;
    private String location;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private EmployeeStatus status = EmployeeStatus.ACTIVE;

    @Column(name = "is_deleted")
    @Builder.Default
    private Boolean isDeleted = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
