-- 飞玖回收系统数据库初始化脚本

CREATE DATABASE IF NOT EXISTS feijiu_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE feijiu_db;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    real_name VARCHAR(50),
    phone VARCHAR(20),
    email VARCHAR(100),
    department_id INT,
    status TINYINT DEFAULT 1,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建角色表
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    status TINYINT DEFAULT 1,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建用户角色关联表
CREATE TABLE IF NOT EXISTS user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建权限表
CREATE TABLE IF NOT EXISTS permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建角色权限关联表
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INT NOT NULL,
    perm_id INT NOT NULL,
    PRIMARY KEY (role_id, perm_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (perm_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建菜单表
CREATE TABLE IF NOT EXISTS menus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    path VARCHAR(100),
    icon VARCHAR(50),
    component VARCHAR(200),
    parent_id INT DEFAULT 0,
    sort_order INT DEFAULT 0,
    status TINYINT DEFAULT 1,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_parent_id (parent_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建部门表
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    parent_id INT DEFAULT 0,
    description TEXT,
    sort_order INT DEFAULT 0,
    status TINYINT DEFAULT 1,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_parent_id (parent_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建师傅表
CREATE TABLE IF NOT EXISTS masters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    level VARCHAR(20) DEFAULT '初级',
    credit_score INT DEFAULT 100,
    total_points INT DEFAULT 0,
    status TINYINT DEFAULT 1,
    bank_account VARCHAR(100),
    bank_name VARCHAR(50),
    id_card_number VARCHAR(18),
    address TEXT,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_phone (phone),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建配件分类表
CREATE TABLE IF NOT EXISTS parts_category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    points_ratio DECIMAL(10,2) DEFAULT 1.00,
    status TINYINT DEFAULT 1,
    sort_order INT DEFAULT 0,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建回收订单表
CREATE TABLE IF NOT EXISTS recycle_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_no VARCHAR(32) NOT NULL UNIQUE,
    master_id INT NOT NULL,
    parts_type INT,
    parts_name VARCHAR(200) NOT NULL,
    parts_code VARCHAR(100),
    quantity INT DEFAULT 1,
    weight DECIMAL(10,2),
    points INT DEFAULT 0,
    amount DECIMAL(10,2) DEFAULT 0.00,
    status TINYINT DEFAULT 0,
    point_status TINYINT DEFAULT 0,
    images TEXT,
    remark TEXT,
    audit_time DATETIME,
    audit_user_id INT,
    audit_remark TEXT,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_order_no (order_no),
    INDEX idx_master_id (master_id),
    INDEX idx_status (status),
    FOREIGN KEY (master_id) REFERENCES masters(id) ON DELETE CASCADE,
    FOREIGN KEY (parts_type) REFERENCES parts_category(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建积分记录表
CREATE TABLE IF NOT EXISTS points_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    master_id INT NOT NULL,
    recycle_id INT,
    points_type VARCHAR(20) NOT NULL,
    points_amount INT NOT NULL,
    balance_after INT NOT NULL,
    related_order_no VARCHAR(32),
    remark TEXT,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_master_id (master_id),
    FOREIGN KEY (master_id) REFERENCES masters(id) ON DELETE CASCADE,
    FOREIGN KEY (recycle_id) REFERENCES recycle_orders(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建资金账户表
CREATE TABLE IF NOT EXISTS fund_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    master_id INT NOT NULL UNIQUE,
    balance DECIMAL(12,2) DEFAULT 0.00,
    frozen_balance DECIMAL(12,2) DEFAULT 0.00,
    total_income DECIMAL(12,2) DEFAULT 0.00,
    total_withdraw DECIMAL(12,2) DEFAULT 0.00,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (master_id) REFERENCES masters(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建资金流水表
CREATE TABLE IF NOT EXISTS fund_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    txn_no VARCHAR(32) NOT NULL UNIQUE,
    master_id INT NOT NULL,
    txn_type VARCHAR(20) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    balance_before DECIMAL(12,2) DEFAULT 0.00,
    balance_after DECIMAL(12,2) DEFAULT 0.00,
    status TINYINT DEFAULT 0,
    remark TEXT,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_txn_no (txn_no),
    INDEX idx_master_id (master_id),
    INDEX idx_txn_type (txn_type),
    INDEX idx_status (status),
    FOREIGN KEY (master_id) REFERENCES masters(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建工单表
CREATE TABLE IF NOT EXISTS tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_no VARCHAR(32) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    type VARCHAR(20) DEFAULT 'feedback',
    status TINYINT DEFAULT 0,
    priority TINYINT DEFAULT 1,
    master_id INT,
    reply_content TEXT,
    reply_time DATETIME,
    reply_user_id INT,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ticket_no (ticket_no),
    INDEX idx_status (status),
    FOREIGN KEY (master_id) REFERENCES masters(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建工作流任务表
CREATE TABLE IF NOT EXISTS workflow_tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_no VARCHAR(32) NOT NULL UNIQUE,
    process_type VARCHAR(50) NOT NULL,
    business_id INT NOT NULL,
    current_node VARCHAR(50) NOT NULL,
    status TINYINT DEFAULT 0,
    assignee_id INT,
    creator_id INT,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_task_no (task_no),
    INDEX idx_business_id (business_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建表单表
CREATE TABLE IF NOT EXISTS forms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    schema TEXT,
    status TINYINT DEFAULT 1,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建登录日志表
CREATE TABLE IF NOT EXISTS login_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    username VARCHAR(50) NOT NULL,
    ip_address VARCHAR(50),
    user_agent VARCHAR(500),
    login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TINYINT NOT NULL,
    error_msg VARCHAR(255),
    INDEX idx_user_id (user_id),
    INDEX idx_login_time (login_time),
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建操作日志表
CREATE TABLE IF NOT EXISTS operation_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    username VARCHAR(50) NOT NULL,
    module VARCHAR(50),
    operation VARCHAR(50),
    target_id INT,
    target_name VARCHAR(255),
    before_data TEXT,
    after_data TEXT,
    ip_address VARCHAR(50),
    user_agent VARCHAR(500),
    operation_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TINYINT DEFAULT 1,
    error_msg VARCHAR(255),
    INDEX idx_user_id (user_id),
    INDEX idx_operation_time (operation_time),
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建小程序配置表
CREATE TABLE IF NOT EXISTS miniapp_configs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value TEXT,
    config_group VARCHAR(50) DEFAULT 'general',
    description TEXT,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_config_key (config_key),
    INDEX idx_config_group (config_group)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入初始数据

-- 初始管理员用户 (密码: admin123)
INSERT IGNORE INTO users (id, username, password, real_name, phone, status) VALUES
(1, 'admin', '$2b$12$EixZaYbB.rK4fl8x2q7Meu6Q6D2V5fF5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q', '管理员', '13800138000', 1);

-- 初始角色
INSERT IGNORE INTO roles (id, name, code, description) VALUES
(1, '超级管理员', 'admin', '系统最高权限角色'),
(2, '普通用户', 'user', '普通用户角色');

-- 初始用户角色关联
INSERT IGNORE INTO user_roles (user_id, role_id) VALUES
(1, 1);

-- 初始部门
INSERT IGNORE INTO departments (id, name, description) VALUES
(1, '总部', '公司总部'),
(2, '技术部', '技术研发部门'),
(3, '运营部', '运营管理部门');

-- 初始师傅数据
INSERT IGNORE INTO masters (id, name, phone, level, credit_score) VALUES
(1, '张师傅', '13800138001', '高级', 83),
(2, '李师傅', '13800138002', '专家', 66),
(3, '王师傅', '13800138003', '中级', 65),
(4, '赵师傅', '13800138004', '初级', 77),
(5, '刘师傅', '13800138005', '高级', 79),
(6, '陈师傅', '13800138006', '中级', 85),
(7, '杨师傅', '13800138007', '初级', 99),
(8, '黄师傅', '13800138008', '专家', 92),
(9, '周师傅', '13800138009', '高级', 92),
(10, '吴师傅', '13800138010', '中级', 92);

-- 初始配件分类
INSERT IGNORE INTO parts_category (id, category_name, points_ratio) VALUES
(1, '发动机总成', 2.50),
(2, '变速箱总成', 2.00),
(3, '车门总成', 1.50),
(4, '轮胎', 0.50),
(5, '电瓶', 0.80),
(6, '座椅', 0.60),
(7, '仪表盘', 1.20),
(8, '空调系统', 1.80),
(9, '车灯', 0.30),
(10, '其他配件', 0.20);

-- 初始小程序配置
INSERT IGNORE INTO miniapp_configs (config_key, config_value, config_group, description) VALUES
('app_name', '飞玖回收', 'general', '小程序名称'),
('app_logo', '', 'general', '小程序Logo'),
('app_description', '专业的汽车配件回收平台', 'general', '小程序描述'),
('service_phone', '400-123-4567', 'general', '客服电话'),
('home_banner1', '', '首页', '首页轮播图1'),
('home_banner2', '', '首页', '首页轮播图2'),
('home_banner3', '', '首页', '首页轮播图3'),
('enable_recycle', '1', '功能', '启用回收功能'),
('enable_points', '1', '功能', '启用积分功能'),
('enable_withdraw', '1', '功能', '启体现功能'),
('enable_ticket', '1', '功能', '启用工单功能'),
('primary_color', '#2563EB', '配色', '主色调'),
('secondary_color', '#10B981', '配色', '辅助色'),
('warning_color', '#F59E0B', '配色', '警告色'),
('danger_color', '#EF4444', '配色', '危险色'),
('welcome_title', '欢迎使用飞玖回收', '文案', '欢迎标题'),
('welcome_desc', '让每一个配件都有价值', '文案', '欢迎描述'),
('recycle_success', '回收成功！积分已到账', '文案', '回收成功提示'),
('points_rule_title', '积分规则', '文案', '积分规则标题'),
('points_rule_content', '每回收1元配件可获得1积分', '文案', '积分规则内容');

COMMIT;