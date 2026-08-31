package com.keystone.backend.repository;

import com.keystone.backend.entity.WorkOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkOrderRepository extends JpaRepository<WorkOrder, Long> {

    List<WorkOrder> findByCustomerId(Long customerId);

    List<WorkOrder> findBySiteId(Long siteId);

    List<WorkOrder> findByStatus(String status);
}