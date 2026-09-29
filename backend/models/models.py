"""
Praja to Policy - Database Models (MySQL / Relational Schema)
This file defines the relational tables, constraints, and relationships.
"""

from datetime import datetime

# Schema definition for MySQL / Relational Database:
SQL_SCHEMA_CREATION = """
-- Users table: Citizens, Government Employees, and Admins
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('citizen', 'employee', 'admin') NOT NULL DEFAULT 'citizen',
    employee_code VARCHAR(50) UNIQUE NULL,
    department VARCHAR(100) NULL,
    designation VARCHAR(100) NULL,
    age INT NULL,
    occupation VARCHAR(100) NULL,
    income DECIMAL(12, 2) NULL,
    state VARCHAR(100) NULL,
    district VARCHAR(100) NULL,
    city VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_role (role),
    INDEX idx_employee_code (employee_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Schemes table: Across Agriculture, Education, Health, Housing, etc.
CREATE TABLE IF NOT EXISTS schemes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    category ENUM('Agriculture', 'Education', 'Health', 'Employment', 'Housing', 'Financial Assistance', 'Women & Child', 'Energy', 'Other') NOT NULL,
    description TEXT NOT NULL,
    eligibility TEXT NOT NULL,
    benefits TEXT NOT NULL,
    required_documents TEXT NOT NULL,
    application_process TEXT NOT NULL,
    official_url VARCHAR(500) NOT NULL,
    min_age INT DEFAULT 0,
    max_age INT DEFAULT 120,
    max_income DECIMAL(12, 2) NULL,
    target_occupations JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_scheme_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Complaints table: Citizen civic reports with Demo AI insights & media
CREATE TABLE IF NOT EXISTS complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id VARCHAR(50) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    description TEXT NOT NULL,
    summary TEXT,
    category VARCHAR(100) NOT NULL,
    sentiment VARCHAR(50) DEFAULT 'Neutral',
    urgency ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    priority ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
    confidence DECIMAL(5, 2) DEFAULT 85.00,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    media_urls JSON NULL, -- photos and videos attached
    status ENUM('Submitted', 'Under Review', 'Forwarded to Department', 'In Progress', 'Resolved') DEFAULT 'Submitted',
    assigned_department VARCHAR(100) NOT NULL,
    assigned_employee_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_employee_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_complaint_status (status),
    INDEX idx_complaint_dept (assigned_department),
    INDEX idx_complaint_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Complaint status audit trail
CREATE TABLE IF NOT EXISTS complaint_status_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id INT NOT NULL,
    old_status VARCHAR(50) NOT NULL,
    new_status VARCHAR(50) NOT NULL,
    note TEXT,
    updated_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_history_complaint (complaint_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
"""
