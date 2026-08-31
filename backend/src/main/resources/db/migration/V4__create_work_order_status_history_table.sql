CREATE TABLE work_order_status_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    work_order_id BIGINT NOT NULL,
    old_status VARCHAR(50) NOT NULL,
    new_status VARCHAR(50) NOT NULL,
    remarks VARCHAR(255),
    changed_at DATETIME NOT NULL,

    CONSTRAINT fk_status_history_work_order
        FOREIGN KEY (work_order_id)
        REFERENCES work_orders(id)
        ON DELETE CASCADE
);