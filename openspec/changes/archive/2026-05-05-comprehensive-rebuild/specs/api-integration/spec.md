# API Integration Spec

## ADDED Requirements

### Requirement: API Request Wrapper
The system MUST provide a centralized API request wrapper at `frontend/src/lib/api.ts`.

- The wrapper MUST expose `get`, `post`, `put`, and `del` methods
- All requests MUST automatically read JWT token from localStorage and inject it as `Authorization: Bearer <token>` header
- All requests MUST set `Content-Type: application/json` header
- Failed requests (HTTP 4xx/5xx) MUST throw an exception containing the error message from the backend

#### Scenario: API call with JWT token
- **Given** a user is authenticated with a valid JWT token stored in localStorage
- **When** a page calls `api.get("/users/me")` through the centralized wrapper
- **Then** the request is sent with `Authorization: Bearer <token>` and `Content-Type: application.json` headers automatically injected

### Requirement: API Endpoint Coverage
The frontend MUST integrate with all backend API modules.

- The system MUST connect the following modules to real APIs: auth, users, roles, permissions, menus, departments, masters, recycle, fund, workflow, forms, tickets, dashboard, miniapp, upload
- All CRUD operations MUST use API calls; mock data MUST NOT be used in production pages
- The frontend MUST define TypeScript interfaces for all API request and response shapes
- TypeScript types MUST be derived from backend Pydantic schemas

#### Scenario: Frontend calling a backend endpoint
- **Given** the frontend has integrated with all backend API modules
- **When** the recycle list page loads and sends a GET request to `/api/v1/recycles`
- **Then** the response data is typed against the corresponding TypeScript interface and rendered without falling back to mock data

### Requirement: Environment Configuration
The system MUST support both development and production environments.

- Development environment API base URL MUST be `http://localhost:8000/api/v1`
- Production environment API base URL MUST be `/api/v1` (via Docker reverse proxy)
- `vite.config.ts` MUST proxy `/api` requests to the backend server

#### Scenario: Dev/prod API routing
- **Given** the application is running in development mode
- **When** the frontend makes an API request to any endpoint
- **Then** the request targets `http://localhost:8000/api/v1`; when running in Docker production, the request targets `/api/v1` via the reverse proxy

### Requirement: Loading State
All API calls MUST provide loading state feedback.

- Components MUST be able to track pending request state
- Both global loading indicators and per-component loading states are acceptable

#### Scenario: Showing loading indicator during API call
- **Given** a user navigates to the recycle orders page
- **When** the page initiates a GET request to fetch the order list
- **Then** a loading indicator is displayed until the response arrives, after which the data renders and the loading indicator is removed
