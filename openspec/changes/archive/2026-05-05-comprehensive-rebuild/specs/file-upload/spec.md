# File Upload Spec

## ADDED Requirements

### Requirement: File Upload Endpoint
The system MUST provide a file upload API.

- The backend MUST provide a `POST /api/v1/uploads` endpoint
- The endpoint MUST accept multipart/form-data format
- Uploaded files MUST be stored in the `uploads/` directory
- The endpoint MUST return the file access URL on success

#### Scenario: Upload a valid image file
- **Given** a user is authenticated and has a valid image file (e.g., a 2MB PNG)
- **When** the user sends a `POST /api/v1/uploads` request with the image as multipart/form-data
- **Then** the server stores the file in the `uploads/` directory with a UUID filename and returns the file access URL

### Requirement: File Type and Size Validation
The system MUST validate uploaded files.

- The system MUST only accept image formats: jpg, jpeg, png, webp
- Single file size limit MUST be 5MB
- Invalid format or oversized files MUST return HTTP 400 with an error message

#### Scenario: Upload an invalid file type
- **Given** a user is authenticated and attempts to upload a `.pdf` file
- **When** the user sends a `POST /api/v1/uploads` request with the PDF file
- **Then** the server rejects the file and returns HTTP 400 with an error message indicating the file format is not allowed

### Requirement: File Access
The system MUST serve uploaded files via static paths.

- Uploaded files MUST be accessible via `/uploads/<filename>`
- Filenames MUST be renamed using UUID to avoid conflicts
- Original filename MUST be preserved in the database for display purposes

#### Scenario: Access an uploaded file via URL
- **Given** a file has been successfully uploaded and stored with a UUID filename
- **When** a user requests `/uploads/<uuid-filename>.png`
- **Then** the server returns the file content with the appropriate image MIME type

### Requirement: Frontend Upload Component
The frontend MUST provide a file upload component.

- The upload component MUST support both drag-and-click upload
- Upload progress MUST be displayed during file transfer
- Upload failures MUST display error messages to the user
- The component MUST support image preview after upload
- The upload component MUST be integrated into the recycle order form

#### Scenario: Drag and drop an image file
- **Given** a user is on the recycle order form page
- **When** the user drags an image file from their desktop and drops it into the upload component
- **Then** the component displays upload progress, shows the image preview upon completion, and populates the form with the file URL
