# Recycle Workflow Spec

## ADDED Requirements

### Requirement: Recycle Order State Machine
The system MUST implement a strict state machine for recycle order lifecycle.

- The system MUST define the following states: 待审核(0), 审核通过(1), 审核驳回(2), 已入库(3), 已处置(4), 待重传(5), 已关闭(6), 积分已发放(7)
- Valid transitions MUST be:
  - 待审核(0) → 审核通过(1) | 审核驳回(2) | 待重传(5)
  - 审核通过(1) → 已入库(3)
  - 已入库(3) → 已处置(4)
  - 已处置(4) → 积分已发放(7)
  - 审核驳回(2) → 待审核(0) (on resubmission)
  - 待重传(5) → 待审核(0) (on resubmission)
  - Any state → 已关闭(6) (admin only)
- 已关闭(6) MUST be a terminal state; no further transitions are allowed
- The system MUST NOT allow skipping states (e.g., 待审核 → 已处置 is forbidden)
- All state changes MUST record the operator and timestamp

#### Scenario: Order transitions from 待审核 to 审核通过
- **Given** a recycle order in 待审核(0) status
- **When** an auditor approves the order
- **Then** the order state changes to 审核通过(1), and the operator and timestamp are recorded

### Requirement: Order CRUD
The system MUST provide full CRUD operations for recycle orders.

- Users MUST be able to create recycle orders with: parts category, quantity, images, master info
- The order list MUST support filtering by status, date range, and master
- Order detail view MUST display audit records and full state change history
- Orders in 待审核(0) or 待重传(5) status MUST be editable
- Only admin users MAY close orders (→ 已关闭(6))

#### Scenario: User creates a new recycle order with images
- **Given** a user on the recycle order creation form
- **When** the user fills in parts category, quantity, master info, and uploads images, then submits
- **Then** a new recycle order is created in 待审核(0) status with the uploaded images attached

### Requirement: Audit Workflow
The system MUST support order audit operations.

- Auditors MUST be able to approve, reject, or request resubmission for orders
- Approval MUST allow an optional audit comment
- Rejection MUST require a rejection reason (mandatory field)
- After audit, the system MUST automatically update the order state

#### Scenario: Auditor rejects an order with a reason
- **Given** a recycle order in 待审核(0) status and an auditor reviewing it
- **When** the auditor selects reject and provides a rejection reason, then submits
- **Then** the order state changes to 审核驳回(2) and the rejection reason is stored with the audit record

### Requirement: Points Distribution
The system MUST calculate and distribute points for processed orders.

- Orders in 已处置(4) status MUST be eligible for points distribution
- Points MUST be calculated based on parts category and quantity
- After distribution, the order state MUST change to 积分已发放(7)
- Points records MUST be written to the `points_records` table

#### Scenario: Points are awarded after order disposal
- **Given** a recycle order in 已处置(4) status with a parts category and quantity
- **When** the points distribution process runs for the order
- **Then** points are calculated based on parts category unit price and quantity, a record is written to `points_records`, and the order state changes to 积分已发放(7)

### Requirement: Parts Categories
The system MUST maintain a parts category catalog.

- The system MUST pre-populate parts categories (in `parts_categories` table)
- Each category MUST include: name, unit, points unit price
- Admin users MUST be able to manage (CRUD) categories

#### Scenario: Admin creates a new parts category
- **Given** an admin user on the parts category management page
- **When** the admin fills in a name, unit, and points unit price, then submits the form
- **Then** a new parts category is created and available for use in recycle orders
