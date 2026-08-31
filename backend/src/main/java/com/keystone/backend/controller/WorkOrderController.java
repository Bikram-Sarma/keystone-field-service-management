package com.keystone.backend.controller;

import com.keystone.backend.entity.WorkOrder;
import com.keystone.backend.service.WorkOrderService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class WorkOrderController {

    private final WorkOrderService workOrderService;

    public WorkOrderController(
            WorkOrderService workOrderService
    ) {
        this.workOrderService = workOrderService;
    }

    // =========================================================
    // CREATE WORK ORDER
    // =========================================================

    @PostMapping("/customers/{customerId}/sites/{siteId}/work-orders")
    public ResponseEntity<WorkOrder> createWorkOrder(
            @PathVariable Long customerId,
            @PathVariable Long siteId,
            @RequestBody WorkOrder workOrder
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        workOrderService.createWorkOrder(
                                customerId,
                                siteId,
                                workOrder
                        )
                );
    }

    // =========================================================
    // GET ALL WORK ORDERS
    // =========================================================

    @GetMapping("/work-orders")
    public ResponseEntity<List<WorkOrder>> getAllWorkOrders() {

        return ResponseEntity.ok(
                workOrderService.getAllWorkOrders()
        );
    }

    // =========================================================
    // GET WORK ORDER BY ID
    // =========================================================

    @GetMapping("/work-orders/{id}")
    public ResponseEntity<WorkOrder> getWorkOrderById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                workOrderService.getWorkOrderById(id)
        );
    }

    // =========================================================
    // GET WORK ORDERS BY CUSTOMER
    // =========================================================

    @GetMapping("/customers/{customerId}/work-orders")
    public ResponseEntity<List<WorkOrder>> getWorkOrdersByCustomerId(
            @PathVariable Long customerId
    ) {

        return ResponseEntity.ok(
                workOrderService.getWorkOrdersByCustomerId(
                        customerId
                )
        );
    }

    // =========================================================
    // GET WORK ORDERS BY SITE
    // =========================================================

    @GetMapping("/sites/{siteId}/work-orders")
    public ResponseEntity<List<WorkOrder>> getWorkOrdersBySiteId(
            @PathVariable Long siteId
    ) {

        return ResponseEntity.ok(
                workOrderService.getWorkOrdersBySiteId(
                        siteId
                )
        );
    }

    // =========================================================
    // GET WORK ORDERS BY STATUS
    // =========================================================

    @GetMapping("/work-orders/status/{status}")
    public ResponseEntity<List<WorkOrder>> getWorkOrdersByStatus(
            @PathVariable String status
    ) {

        return ResponseEntity.ok(
                workOrderService.getWorkOrdersByStatus(
                        status
                )
        );
    }

    // =========================================================
    // UPDATE WORK ORDER
    // =========================================================

    @PutMapping("/work-orders/{id}")
    public ResponseEntity<WorkOrder> updateWorkOrder(
            @PathVariable Long id,
            @RequestBody WorkOrder workOrder
    ) {

        return ResponseEntity.ok(
                workOrderService.updateWorkOrder(
                        id,
                        workOrder
                )
        );
    }

    // =========================================================
    // ASSIGN WORK ORDER TO TECHNICIAN
    // =========================================================

    @PutMapping("/work-orders/{workOrderId}/assign/{technicianId}")
    public ResponseEntity<WorkOrder> assignWorkOrder(
            @PathVariable Long workOrderId,
            @PathVariable Long technicianId
    ) {

        return ResponseEntity.ok(
                workOrderService.assignWorkOrder(
                        workOrderId,
                        technicianId
                )
        );
    }

    // =========================================================
    // DELETE WORK ORDER
    // =========================================================

    @DeleteMapping("/work-orders/{id}")
    public ResponseEntity<Void> deleteWorkOrder(
            @PathVariable Long id
    ) {

        workOrderService.deleteWorkOrder(id);

        return ResponseEntity.noContent().build();
    }
}