package com.keystone.backend.controller;

import com.keystone.backend.entity.WorkOrderStatusHistory;
import com.keystone.backend.service.WorkOrderStatusHistoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/work-orders/{workOrderId}/status-history")
public class WorkOrderStatusHistoryController {

    private final WorkOrderStatusHistoryService historyService;

    public WorkOrderStatusHistoryController(
            WorkOrderStatusHistoryService historyService
    ) {
        this.historyService = historyService;
    }

    // Add status history
    @PostMapping
    public ResponseEntity<WorkOrderStatusHistory> addStatusHistory(
            @PathVariable Long workOrderId,
            @RequestBody WorkOrderStatusHistory history
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        historyService.addStatusHistory(
                                workOrderId,
                                history
                        )
                );
    }

    // Get all status history for a work order
    @GetMapping
    public ResponseEntity<List<WorkOrderStatusHistory>> getStatusHistory(
            @PathVariable Long workOrderId
    ) {
        return ResponseEntity.ok(
                historyService.getHistoryByWorkOrderId(workOrderId)
        );
    }
}