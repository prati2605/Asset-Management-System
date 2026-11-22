package com.ecr.ams.common;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;
import java.time.LocalDateTime;

@MappedSuperclass
@Getter @Setter
public abstract class BaseEntity {
    @Id @GeneratedValue(generator = "UUID") @UuidGenerator
    @Column(name = "id", updatable = false, nullable = false, length = 36)
    private String id;

    @CreationTimestamp @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // --- NEW: SOFT DELETE & AUDIT FIELDS ---
    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted = false;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
