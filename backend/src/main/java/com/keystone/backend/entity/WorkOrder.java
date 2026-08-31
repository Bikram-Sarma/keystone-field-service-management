package com.keystone.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "work_orders")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class WorkOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================================================
    // WORK ORDER CODE
    // =========================================================

    @Column(
            name = "work_order_code",
            nullable = false,
            unique = true,
            length = 30
    )
    private String workOrderCode;

    // =========================================================
    // BASIC DETAILS
    // =========================================================

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    // =========================================================
    // STATUS
    // =========================================================

    @Column(nullable = false, length = 30)
    private String status;

    // =========================================================
    // PRIORITY
    // =========================================================

    @Column(nullable = false, length = 30)
    private String priority;

    // =========================================================
    // SCHEDULED DATE
    // =========================================================

    @Column(name = "scheduled_date")
    private LocalDate scheduledDate;

    // =========================================================
    // CREATED / UPDATED
    // =========================================================

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // =========================================================
    // CUSTOMER
    // =========================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    @JsonIgnoreProperties({
            "hibernateLazyInitializer",
            "handler"
    })
    private Customer customer;

    // =========================================================
    // SITE
    // =========================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "site_id", nullable = false)
    @JsonIgnoreProperties({
            "hibernateLazyInitializer",
            "handler"
    })
    private Site site;

    // =========================================================
    // ASSIGNED TECHNICIAN
    // =========================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_technician_id")
    @JsonIgnoreProperties({
            "hibernateLazyInitializer",
            "handler"
    })
    private User assignedTo;

    // =========================================================
    // CREATED BY
    // =========================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id", nullable = false)
    @JsonIgnoreProperties({
            "hibernateLazyInitializer",
            "handler"
    })
    private User createdBy;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public WorkOrder() {
    }

    // =========================================================
    // BEFORE INSERT
    // =========================================================

    @PrePersist
    public void onCreate() {

        LocalDateTime now = LocalDateTime.now();

        createdAt = now;
        updatedAt = now;

        // Default status
        if (status == null || status.isBlank()) {
            status = "NEW";
        }

        status = status.trim().toUpperCase();

        // Default priority
        if (priority == null || priority.isBlank()) {
            priority = "MEDIUM";
        }

        priority = priority.trim().toUpperCase();

        // Generate work order code
        if (workOrderCode == null || workOrderCode.isBlank()) {
            workOrderCode = "WO-" + System.currentTimeMillis();
        }
    }

    // =========================================================
    // BEFORE UPDATE
    // =========================================================

    @PreUpdate
    public void onUpdate() {

        updatedAt = LocalDateTime.now();

        if (status != null && !status.isBlank()) {
            status = status.trim().toUpperCase();
        }

        if (priority != null && !priority.isBlank()) {
            priority = priority.trim().toUpperCase();
        }
    }

    // =========================================================
    // GETTERS AND SETTERS
    // =========================================================

    public Long getId() {
        return id;
    }

    public String getWorkOrderCode() {
        return workOrderCode;
    }

    public void setWorkOrderCode(String workOrderCode) {
        this.workOrderCode = workOrderCode;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public LocalDate getScheduledDate() {
        return scheduledDate;
    }

    public void setScheduledDate(LocalDate scheduledDate) {
        this.scheduledDate = scheduledDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Site getSite() {
        return site;
    }

    public void setSite(Site site) {
        this.site = site;
    }

    // =========================================================
    // ASSIGNED TECHNICIAN GETTER / SETTER
    // =========================================================

    public User getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(User assignedTo) {
        this.assignedTo = assignedTo;
    }

    // =========================================================
    // CREATED BY GETTER / SETTER
    // =========================================================

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }
}