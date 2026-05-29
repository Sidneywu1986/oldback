# Workflow Engine Spec

## ADDED Requirements

### Requirement: Workflow Definition
The system MUST provide predefined workflow templates.

- The system MUST include predefined workflow templates: 回收审核流程 (Recycle Audit), 提现审核流程 (Withdrawal Audit)
- Workflow definitions MUST be stored in the `workflow_defs` table
- Each workflow definition MUST include: name, node list, transition conditions

#### Scenario: Creating a new workflow definition with nodes
Given an admin user is on the workflow configuration page,
When the admin creates a new workflow definition named "回收审核流程" with nodes [Submit, Audit, Approve/Reject, Complete] and sets transition conditions for each node,
Then the system stores the definition in the `workflow_defs` table with the correct name, ordered node list, and transition conditions, and the definition appears in the workflow template list.

### Requirement: Workflow Instance
The system MUST create workflow instances for business operations.

- Each business operation (e.g., submitting a recycle order) MUST create a workflow instance
- Each instance MUST track: current state, initiator, creation time, completion time
- Instance data MUST be stored in the `workflow_instances` table

#### Scenario: Recycle order automatically creates a workflow instance
Given a master submits a new recycle order with parts details,
When the recycle order is persisted to the database,
Then the system automatically creates a workflow instance in the `workflow_instances` table with the correct current state (e.g., "Pending Audit"), the submitting master as initiator, and the creation time set to now.

### Requirement: Todo Tasks
The system MUST generate todo tasks at approval nodes.

- When a workflow reaches an approval node, the system MUST generate a todo task
- Each task MUST include: task type, associated business record, assignee, creation time, deadline
- The frontend `/workflow/todo` page MUST display the current user's todo list
- Todo tasks MUST support pagination

#### Scenario: Approver sees pending tasks after order submission
Given a recycle order has been submitted and a workflow instance is created with the current node at "Audit",
When the assigned approver navigates to the `/workflow/todo` page,
Then the approver sees the pending audit task in their todo list with the correct task type, associated recycle order reference, assignee, creation time, and deadline.

### Requirement: Done Tasks
The system MUST maintain a history of completed tasks.

- After a task is processed, it MUST move to the done list
- Done records MUST include: processing result, processing comment, processing time
- The frontend `/workflow/done` page MUST display the current user's done list
- Done tasks MUST support pagination

#### Scenario: Viewing completed tasks with processing results
Given an approver has previously processed multiple workflow tasks (some approved, some rejected),
When the approver navigates to the `/workflow/done` page,
Then the approver sees their completed tasks with each record showing the processing result (approve/reject), the processing comment they entered, and the processing time.

### Requirement: Approval Operations
The system MUST support approval actions on workflow tasks.

- Approvers MUST be able to: approve, reject, or reassign tasks
- Approve → workflow advances to the next node
- Reject → workflow returns to the start or previous node
- Reassign → assign a new processor for the task

#### Scenario: Approver approves a task and workflow advances
Given an approver views a pending audit task in their todo list with approve and reject actions available,
When the approver clicks "Approve" and submits an approval comment,
Then the task moves from the todo list to the done list with the approved result, the workflow instance advances to the next node in the definition, and if the next node is an approval node, a new todo task is generated for the next approver.
