# auth-rbac Specification

## Purpose
TBD - created by archiving change comprehensive-rebuild. Update Purpose after archive.
## Requirements
### Requirement: JWT Authentication
The system MUST implement JWT-based authentication.

#### Scenario: User logs in with valid credentials
- **Given** a registered user with username "admin" and password "admin123"
- **When** the user submits the login form with correct credentials
- **Then** the backend returns a JWT access token with token_type "bearer", and the frontend stores both the token and user info in localStorage

- On successful login, the backend MUST return `{ access_token: string, token_type: "bearer" }`
- The frontend MUST store both token and user info in localStorage
- When token expires, the frontend MUST automatically redirect to `/login`
- All protected backend endpoints MUST validate the JWT token; invalid or expired tokens MUST return 401

### Requirement: Roles and Permissions
The system MUST implement role-based access control.

#### Scenario: Admin assigns permissions to a role
- **Given** a super admin is logged in and navigating the role management page
- **When** the admin selects the "审核员" (Auditor) role and grants it "recycle:audit" and "recycle:view" permissions
- **Then** the permissions are saved to the role_permissions table, and users with the Auditor role can subsequently access audit-related menus and endpoints

- The system MUST predefine roles: 超级管理员 (Super Admin), 审核员 (Auditor), 财务 (Finance), 运营 (Operations)
- 超级管理员 MUST have all permissions
- Other roles MUST be associated with permissions via the `role_permissions` table
- Permission granularity MUST be at the menu level (visible / hidden)

### Requirement: Frontend Route Guard
The frontend MUST enforce authentication and authorization on routes.

#### Scenario: Unauthenticated user accesses a protected page
- **Given** a user who is not logged in (no token in localStorage)
- **When** the user navigates to `/dashboard` or any non-`/login` URL
- **Then** the route guard detects the missing token and automatically redirects the user to the `/login` page

- Unauthenticated users accessing any non-`/login` page MUST be redirected to `/login`
- Authenticated users accessing pages without permission MUST see a 403 notification
- The sidebar menu MUST be dynamically rendered based on the user's permissions

### Requirement: Backend Permission Middleware
The backend MUST enforce permission checks on all protected routes.

#### Scenario: User without permission accesses a protected endpoint
- **Given** a user with the "运营" (Operations) role who lacks "fund:withdraw" permission
- **When** the user sends a DELETE request to `/api/v1/fund/withdraw/123`
- **Then** the backend middleware checks the user's role against the required permission code, finds insufficient permissions, and returns a 403 response without executing the endpoint logic

- Each protected route MUST inject the current user via FastAPI dependency
- The system MUST validate the user's role against required permission codes
- Requests without sufficient permission MUST return 403

### Requirement: Password Security
The system MUST store and handle passwords securely.

#### Scenario: Password change requires old password verification
- **Given** an authenticated user navigating to the password change form
- **When** the user submits a new password without providing the correct old password (or with an incorrect old password)
- **Then** the backend rejects the request with an error indicating the old password is incorrect, and the password remains unchanged

- Passwords MUST be hashed using bcrypt before storage
- The login response MUST NOT include the password field
- Password changes MUST require verification of the old password

