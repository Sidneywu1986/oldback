# error-handling Specification

## Purpose
TBD - created by archiving change comprehensive-rebuild. Update Purpose after archive.
## Requirements
### Requirement: Unified Response Format
The system MUST use a consistent response format for all API responses.

- All API responses MUST follow the format `{ code: int, msg: str, data: any }`
- Success responses MUST use `code = 200` and `msg = "ok"`
- Client error responses MUST use `code = 4xx` with a human-readable `msg`
- Server error responses MUST use `code = 5xx` with a generic `msg` that does NOT expose internal details

#### Scenario: API returns unified response format for success and error
- **Given** a client makes an API request (e.g., `GET /api/v1/masters`)
- **When** the server processes the request successfully
- **Then** the response body MUST be `{ code: 200, msg: "ok", data: [...] }`
- **Given** a client makes an invalid request (e.g., missing required parameter)
- **When** the server rejects the request
- **Then** the response body MUST be `{ code: 400, msg: "Bad Request: missing field X", data: null }` and MUST NOT expose internal stack traces

### Requirement: Error Code Definitions
The system MUST define and use standard error codes.

- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (not authenticated or token expired)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource does not exist)
- `422` - Validation Error (data validation failed)
- `500` - Internal Server Error

#### Scenario: Error codes are returned correctly
- **Given** a client makes requests that trigger different error conditions
- **When** the server encounters an invalid parameter, expired token, insufficient permission, missing resource, validation failure, or internal error
- **Then** the response `code` MUST be `400`, `401`, `403`, `404`, `422`, or `500` respectively, with a descriptive `msg` for each case

### Requirement: Frontend Error Interception
The frontend MUST intercept and handle errors uniformly.

- `api.ts` MUST intercept all non-200 code responses
- On 401, the system MUST clear localStorage and redirect to `/login`
- On 403, the system MUST display a "no permission" notification
- On 400/422, the system MUST display the `msg` returned by the backend
- On 500, the system MUST display "服务器繁忙，请稍后重试"
- On network errors, the system MUST display "网络连接失败"

#### Scenario: 401 redirects to login page
- **Given** a user's JWT token has expired or is invalid
- **When** the frontend receives a `401` response from any API call
- **Then** the system MUST clear `localStorage` (remove token and user data) and redirect the browser to `/login`

### Requirement: Backend Exception Handling
The backend MUST handle all exceptions globally.

- A global exception handler MUST catch all unhandled exceptions
- All error responses MUST follow the unified format
- Internal stack traces MUST NOT be exposed to clients
- Errors MUST be logged to console and/or file for debugging

#### Scenario: Unhandled exception returns 500 without exposing internals
- **Given** an unhandled exception occurs in the backend (e.g., database connection failure)
- **When** the global exception handler catches the error
- **Then** the response MUST be `{ code: 500, msg: "Internal Server Error", data: null }`, the stack trace MUST be logged server-side only, and the client MUST NOT receive any internal details

### Requirement: Data Validation
The system MUST validate all incoming request data.

- The backend MUST use Pydantic schemas to validate request data
- Validation failures MUST return HTTP 422 with detailed field-level error messages
- The frontend MUST highlight corresponding form fields based on field-level errors

#### Scenario: Invalid form data returns 422 with field errors
- **Given** a user submits a form with invalid data (e.g., empty required field, malformed email)
- **When** the backend Pydantic validation rejects the payload
- **Then** the response MUST be `{ code: 422, msg: "Validation Error", data: { "email": "invalid email format", "name": "field required" } }`, and the frontend MUST highlight the `email` and `name` fields with the corresponding error messages

