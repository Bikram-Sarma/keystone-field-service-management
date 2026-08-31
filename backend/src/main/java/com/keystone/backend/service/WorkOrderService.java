package com.keystone.backend.service;

import com.keystone.backend.entity.Customer;
import com.keystone.backend.entity.Site;
import com.keystone.backend.entity.User;
import com.keystone.backend.entity.WorkOrder;
import com.keystone.backend.repository.CustomerRepository;
import com.keystone.backend.repository.SiteRepository;
import com.keystone.backend.repository.UserRepository;
import com.keystone.backend.repository.WorkOrderRepository;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WorkOrderService {

    private final WorkOrderRepository workOrderRepository;
    private final CustomerRepository customerRepository;
    private final SiteRepository siteRepository;
    private final UserRepository userRepository;
    private final WorkOrderStatusHistoryService statusHistoryService;

    public WorkOrderService(
            WorkOrderRepository workOrderRepository,
            CustomerRepository customerRepository,
            SiteRepository siteRepository,
            UserRepository userRepository,
            WorkOrderStatusHistoryService statusHistoryService
    ) {
        this.workOrderRepository = workOrderRepository;
        this.customerRepository = customerRepository;
        this.siteRepository = siteRepository;
        this.userRepository = userRepository;
        this.statusHistoryService = statusHistoryService;
    }


    // =========================================================
    // CREATE WORK ORDER
    // =========================================================

    public WorkOrder createWorkOrder(
            Long customerId,
            Long siteId,
            WorkOrder workOrder
    ) {

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Customer not found with id: " + customerId
                        )
                );

        Site site = siteRepository.findById(siteId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Site not found with id: " + siteId
                        )
                );

        // Make sure site belongs to selected customer
        if (!site.getCustomer().getId().equals(customerId)) {
            throw new RuntimeException(
                    "Site does not belong to the selected customer"
            );
        }

        // Get currently logged-in user's email
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        // Find logged-in user
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Logged-in user not found: " + email
                        )
                );

        workOrder.setCustomer(customer);
        workOrder.setSite(site);
        workOrder.setCreatedBy(currentUser);

        return workOrderRepository.save(workOrder);
    }


    // =========================================================
    // GET ALL WORK ORDERS
    // =========================================================

    public List<WorkOrder> getAllWorkOrders() {
        return workOrderRepository.findAll();
    }


    // =========================================================
    // GET WORK ORDER BY ID
    // =========================================================

    public WorkOrder getWorkOrderById(Long id) {

        return workOrderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Work order not found with id: " + id
                        )
                );
    }


    // =========================================================
    // GET WORK ORDERS BY CUSTOMER
    // =========================================================

    public List<WorkOrder> getWorkOrdersByCustomerId(
            Long customerId
    ) {

        return workOrderRepository.findByCustomerId(customerId);
    }


    // =========================================================
    // GET WORK ORDERS BY SITE
    // =========================================================

    public List<WorkOrder> getWorkOrdersBySiteId(
            Long siteId
    ) {

        return workOrderRepository.findBySiteId(siteId);
    }


    // =========================================================
    // GET WORK ORDERS BY STATUS
    // =========================================================

    public List<WorkOrder> getWorkOrdersByStatus(
            String status
    ) {

        return workOrderRepository.findByStatus(
                status.trim().toUpperCase()
        );
    }


    // =========================================================
    // UPDATE WORK ORDER
    // =========================================================

    @Transactional
    public WorkOrder updateWorkOrder(
            Long id,
            WorkOrder updatedWorkOrder
    ) {

        WorkOrder existingWorkOrder =
                getWorkOrderById(id);

        // Save old status before changing it
        String oldStatus =
                existingWorkOrder.getStatus();

        String newStatus =
                updatedWorkOrder.getStatus();

        // Update normal fields
        existingWorkOrder.setTitle(
                updatedWorkOrder.getTitle()
        );

        existingWorkOrder.setDescription(
                updatedWorkOrder.getDescription()
        );

        existingWorkOrder.setPriority(
                updatedWorkOrder.getPriority()
        );

        existingWorkOrder.setScheduledDate(
                updatedWorkOrder.getScheduledDate()
        );


        // =====================================================
        // STATUS CHANGE
        // =====================================================

        if (newStatus != null &&
                !newStatus.isBlank() &&
                !newStatus.trim().equalsIgnoreCase(oldStatus)) {

            newStatus =
                    newStatus.trim().toUpperCase();

            existingWorkOrder.setStatus(newStatus);

            // Save status history
            statusHistoryService.saveStatusChange(
                    existingWorkOrder,
                    oldStatus,
                    newStatus
            );
        }


        return workOrderRepository.save(existingWorkOrder);
    }


    // =========================================================
    // ASSIGN WORK ORDER TO TECHNICIAN
    // =========================================================

    @Transactional
    public WorkOrder assignWorkOrder(
            Long workOrderId,
            Long technicianId
    ) {

        // Find work order
        WorkOrder workOrder = workOrderRepository
                .findById(workOrderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Work order not found with id: "
                                        + workOrderId
                        )
                );


        // Find technician
        User technician = userRepository
                .findById(technicianId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with id: "
                                        + technicianId
                        )
                );


        // Save old status
        String oldStatus =
                workOrder.getStatus();


        // Assign technician
        workOrder.setAssignedTo(technician);


        // If work order is NEW,
        // automatically change it to ASSIGNED
        if ("NEW".equalsIgnoreCase(oldStatus)) {

            workOrder.setStatus("ASSIGNED");

            // Save status history
            statusHistoryService.saveStatusChange(
                    workOrder,
                    oldStatus,
                    "ASSIGNED"
            );
        }


        return workOrderRepository.save(workOrder);
    }


    // =========================================================
    // DELETE WORK ORDER
    // =========================================================

    public void deleteWorkOrder(Long id) {

        WorkOrder workOrder =
                getWorkOrderById(id);

        workOrderRepository.delete(workOrder);
    }
}