package com.keystone.backend.service;

import com.keystone.backend.entity.WorkOrder;
import com.keystone.backend.entity.WorkOrderStatusHistory;
import com.keystone.backend.repository.WorkOrderRepository;
import com.keystone.backend.repository.WorkOrderStatusHistoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkOrderStatusHistoryService {

    private final WorkOrderStatusHistoryRepository historyRepository;
    private final WorkOrderRepository workOrderRepository;

    public WorkOrderStatusHistoryService(
            WorkOrderStatusHistoryRepository historyRepository,
            WorkOrderRepository workOrderRepository
    ) {
        this.historyRepository = historyRepository;
        this.workOrderRepository = workOrderRepository;
    }

    // Add status history manually
    public WorkOrderStatusHistory addStatusHistory(
            Long workOrderId,
            WorkOrderStatusHistory history
    ) {

        WorkOrder workOrder = workOrderRepository
                .findById(workOrderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Work order not found with id: " + workOrderId
                        )
                );

        history.setWorkOrder(workOrder);

        return historyRepository.save(history);
    }

    // Automatically save status change history
    public WorkOrderStatusHistory saveStatusChange(
            WorkOrder workOrder,
            String oldStatus,
            String newStatus
    ) {

        WorkOrderStatusHistory history =
                new WorkOrderStatusHistory();

        history.setWorkOrder(workOrder);
        history.setOldStatus(oldStatus);
        history.setNewStatus(newStatus);
        history.setRemarks(
                "Status changed from " +
                        oldStatus +
                        " to " +
                        newStatus
        );

        return historyRepository.save(history);
    }

    // Get status history of a work order
    public List<WorkOrderStatusHistory> getHistoryByWorkOrderId(
            Long workOrderId
    ) {

        return historyRepository
                .findByWorkOrderId(workOrderId);
    }
}