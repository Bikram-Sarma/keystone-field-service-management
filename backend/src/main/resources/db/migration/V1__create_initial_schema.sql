-- =========================================================
-- KEYSTONE - Initial Database Schema
-- MySQL 8.0
-- =========================================================

-- =========================================================
-- USERS
-- =========================================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL,
    phone VARCHAR(30),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    customer_id BIGINT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_user_role
        CHECK (role IN (
            'MANAGER',
            'DISPATCHER',
            'TECHNICIAN',
            'CUSTOMER'
        ))
);


-- =========================================================
-- CUSTOMERS / ORGANISATIONS
-- =========================================================
CREATE TABLE customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(30),
    address VARCHAR(255),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


-- =========================================================
-- Add customer FK to users
-- =========================================================
ALTER TABLE users
ADD CONSTRAINT fk_users_customer
    FOREIGN KEY (customer_id)
    REFERENCES customers(id)
    ON DELETE SET NULL;


-- =========================================================
-- SITES
-- =========================================================
CREATE TABLE sites (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    name VARCHAR(150) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    contact_name VARCHAR(100),
    contact_phone VARCHAR(30),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_sites_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE CASCADE
);


-- =========================================================
-- WORK ORDERS
-- =========================================================
CREATE TABLE work_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    work_order_code VARCHAR(30) NOT NULL UNIQUE,

    title VARCHAR(200) NOT NULL,
    description TEXT,

    customer_id BIGINT NOT NULL,
    site_id BIGINT NOT NULL,

    assigned_technician_id BIGINT NULL,
    created_by_id BIGINT NOT NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'NEW',
    priority VARCHAR(30) NOT NULL DEFAULT 'MEDIUM',

    sla_due_at TIMESTAMP NULL,

    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    closed_at TIMESTAMP NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_work_order_status
        CHECK (status IN (
            'NEW',
            'ASSIGNED',
            'IN_PROGRESS',
            'ON_HOLD',
            'COMPLETED',
            'CLOSED',
            'CANCELLED'
        )),

    CONSTRAINT chk_work_order_priority
        CHECK (priority IN (
            'LOW',
            'MEDIUM',
            'HIGH',
            'CRITICAL'
        )),

    CONSTRAINT fk_work_orders_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id),

    CONSTRAINT fk_work_orders_site
        FOREIGN KEY (site_id)
        REFERENCES sites(id),

    CONSTRAINT fk_work_orders_technician
        FOREIGN KEY (assigned_technician_id)
        REFERENCES users(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_work_orders_created_by
        FOREIGN KEY (created_by_id)
        REFERENCES users(id)
);


-- =========================================================
-- WORK ORDER STATUS HISTORY
-- =========================================================
CREATE TABLE work_order_status_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    work_order_id BIGINT NOT NULL,
    old_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,

    changed_by_id BIGINT NOT NULL,
    note VARCHAR(500),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_status_history_work_order
        FOREIGN KEY (work_order_id)
        REFERENCES work_orders(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_status_history_user
        FOREIGN KEY (changed_by_id)
        REFERENCES users(id)
);


-- =========================================================
-- PARTS / INVENTORY
-- =========================================================
CREATE TABLE parts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(255),

    unit_cost DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    stock_quantity INT NOT NULL DEFAULT 0,

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_part_stock
        CHECK (stock_quantity >= 0),

    CONSTRAINT chk_part_cost
        CHECK (unit_cost >= 0)
);


-- =========================================================
-- PART USAGE
-- =========================================================
CREATE TABLE part_usage (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    work_order_id BIGINT NOT NULL,
    part_id BIGINT NOT NULL,

    quantity INT NOT NULL,
    unit_cost DECIMAL(12,2) NOT NULL,

    logged_by_id BIGINT NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_part_usage_quantity
        CHECK (quantity > 0),

    CONSTRAINT fk_part_usage_work_order
        FOREIGN KEY (work_order_id)
        REFERENCES work_orders(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_part_usage_part
        FOREIGN KEY (part_id)
        REFERENCES parts(id),

    CONSTRAINT fk_part_usage_user
        FOREIGN KEY (logged_by_id)
        REFERENCES users(id)
);


-- =========================================================
-- TIME LOGS
-- =========================================================
CREATE TABLE time_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    work_order_id BIGINT NOT NULL,
    technician_id BIGINT NOT NULL,

    minutes INT NOT NULL,
    note VARCHAR(500),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_time_minutes
        CHECK (minutes > 0),

    CONSTRAINT fk_time_logs_work_order
        FOREIGN KEY (work_order_id)
        REFERENCES work_orders(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_time_logs_technician
        FOREIGN KEY (technician_id)
        REFERENCES users(id)
);


-- =========================================================
-- NOTIFICATIONS
-- =========================================================
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NOT NULL,

    title VARCHAR(200) NOT NULL,
    message VARCHAR(500) NOT NULL,

    type VARCHAR(50) NOT NULL DEFAULT 'GENERAL',

    read_status BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notifications_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- =========================================================
-- INDEXES
-- =========================================================

CREATE INDEX idx_users_role
    ON users(role);

CREATE INDEX idx_users_customer
    ON users(customer_id);

CREATE INDEX idx_sites_customer
    ON sites(customer_id);

CREATE INDEX idx_work_orders_status
    ON work_orders(status);

CREATE INDEX idx_work_orders_priority
    ON work_orders(priority);

CREATE INDEX idx_work_orders_customer
    ON work_orders(customer_id);

CREATE INDEX idx_work_orders_site
    ON work_orders(site_id);

CREATE INDEX idx_work_orders_technician
    ON work_orders(assigned_technician_id);

CREATE INDEX idx_work_orders_sla
    ON work_orders(sla_due_at);

CREATE INDEX idx_status_history_work_order
    ON work_order_status_history(work_order_id);

CREATE INDEX idx_part_usage_work_order
    ON part_usage(work_order_id);

CREATE INDEX idx_time_logs_work_order
    ON time_logs(work_order_id);

CREATE INDEX idx_time_logs_technician
    ON time_logs(technician_id);

CREATE INDEX idx_notifications_user
    ON notifications(user_id);

CREATE INDEX idx_notifications_read
    ON notifications(read_status);