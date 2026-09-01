# 🔧 Keystone – Field Service Management Platform

Keystone is a full-stack Field Service Management (FSM) platform designed to help organizations manage customers, service sites, technicians, and work orders through a centralized web application.

The project was developed as part of a **Java Full-Stack Engineering Internship at Zidio Development**.

---

## 📌 Project Overview

Keystone provides a structured platform for managing field-service operations. It allows authorized users to authenticate securely and perform operations related to customers, sites, technicians, and work orders.

The application follows a layered architecture with a React frontend, Spring Boot REST API backend, Spring Security with JWT authentication, and MySQL database.

---

## 🎯 Objectives

- Build a real-world Java Full-Stack web application.
- Implement secure user authentication and authorization.
- Develop RESTful APIs using Spring Boot.
- Manage customers and their service locations.
- Manage technicians and work assignments.
- Create, update, assign, track, and manage work orders.
- Store application data using MySQL.
- Implement database version control using Flyway.
- Connect the React frontend with the Spring Boot backend.
- Deploy the application using cloud hosting services.

---

## ✨ Features

### 🔐 Authentication
- User registration
- User login
- JWT-based authentication
- Secure password hashing using BCrypt
- Role-based access support

### 👥 Customer Management
- Create customers
- View all customers
- View customer by ID
- Update customer information
- Delete customers

### 📍 Site Management
- Create service sites for customers
- View customer sites
- View site details
- Update site information
- Delete sites

### 👨‍🔧 Technician Management
- Technician management
- Technician assignment to work orders
- Role-based access support

### 📝 Work Order Management
- Create work orders
- View all work orders
- View work order by ID
- View work orders by customer
- View work orders by site
- Filter work orders by status
- Update work orders
- Assign work orders to technicians
- Delete work orders

### 📊 Work Order Tracking
- Work order status management
- Work order details
- Status/history tracking
- Parts and time-related information where enabled

---

## 🏗️ System Architecture

The application follows a layered full-stack architecture:

```text
                    ┌──────────────────────┐
                    │      React UI        │
                    │   Vite + Axios       │
                    └──────────┬───────────┘
                               │
                               │ HTTP / REST API
                               ▼
                    ┌──────────────────────┐
                    │   Spring Boot API    │
                    │    REST Controllers  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Spring Security   │
                    │   JWT Authentication │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     Service Layer    │
                    │  Business Logic      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Repository Layer     │
                    │ Spring Data JPA      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      MySQL 8.4       │
                    │      Database        │
                    └──────────────────────┘
```
## 🛠️ Technology Stack

### Backend
- Java 21
- Spring Boot 3.5.16
- Spring Security
- JWT Authentication
- BCrypt
- Spring Data JPA
- Hibernate
- Maven

### Frontend
- React
- Vite
- Axios
- HTML5
- CSS3
- JavaScript

### Database
- MySQL 8.4
- Flyway

### Deployment & Tools
- Docker
- Git & GitHub
- Postman
- Render
- Netlify
- VS Code

## ✨ Main Features

- Secure user registration and login
- JWT-based authentication
- Role-based access control
- Customer management
- Service site management
- Technician management
- Work order creation and management
- Work order assignment to technicians
- Work order status tracking
- Work order history
- Parts and time tracking
- RESTful API architecture
- MySQL database integration
- Database migration using Flyway
- Responsive React frontend
- Cloud deployment

  ## 🚀 Run Locally

### Prerequisites

- Java 21
- Node.js
- npm
- MySQL 8.x
- Git

### Clone Repository

```bash
git clone https://github.com/Bikram-Sarma/keystone-field-service-management.git
cd keystone-field-service-management

