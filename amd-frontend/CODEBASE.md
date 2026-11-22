# Railway Asset Management System (AMS) - Frontend Codebase Documentation

## 1. Project Overview
- **Project Name:** Railway Asset Management System (AMS) - Frontend
- **Purpose:** A web application for managing railway assets, tracking employee assignments, and visualizing inventory statistics in an enterprise context.
- **Technology Stack:** React, Vite, TypeScript, Tailwind CSS (optional/used as appropriate for styling), Axios for API communication, Recharts for dashboard visualizations.
- **Architecture Summary:** The frontend follows a standard modular React architecture. It is structured around features/pages, utilizing a centralized routing system and context-based state management (particularly for authentication). It interacts with the Spring Boot backend via RESTful APIs, securing routes based on stateless JWT authentication.

## 2. Folder and File Tree Structure
```text
ams-frontend/
├── public/                # Static assets served directly
├── src/                   # Main source code directory
│   ├── assets/            # Project-specific static files (images, icons)
│   ├── auth/              # Authentication context and route guards
│   ├── components/        # Reusable UI components (Layouts, Modals, Tables, Toast)
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Main application views/routes (Dashboard, Assets, Employees, Login)
│   ├── services/          # API integration layer and Axios wrappers
│   ├── types/             # TypeScript interfaces mapping to backend DTOs
│   ├── utils/             # Helper functions and utilities
│   ├── App.css            # Global application styles
│   ├── App.tsx            # Root component handling routing setup
│   ├── index.css          # Core CSS variables and Tailwind imports
│   └── main.tsx           # Application entry point rendering the React tree
├── .env.development       # Environment variables for dev (API Base URL)
├── package.json           # NPM dependencies and scripts
├── tsconfig.json          # TypeScript compiler configuration
└── vite.config.ts         # Vite bundler and development server configuration
```
*(Note: Generated and dependency folders such as `node_modules` and `dist` are excluded from this tree.)*

## 3. Important Files and Directories Explained

### `src/`
The core directory containing all the application's source code. Everything inside this directory is compiled and bundled by Vite.

### `src/components/`
Contains modular, reusable UI pieces. Examples include a `MainLayout` with a sidebar and top bar, generic tables, modal dialogs, and toast notifications. These are the building blocks of the application pages.

### `src/pages/`
Contains the top-level route components.
- **Login Page:** The entry point for unauthenticated users.
- **Dashboard Page:** Displays KPI metrics and basic visual charts.
- **Assets Page:** Provides CRUD operations for railway assets, including assigning/returning.
- **Employees Page:** Provides CRUD operations for employees.

### `src/services/`
Acts as the API communication layer. It contains Axios wrappers that are pre-configured to handle base URLs, attach headers, and manage standard HTTP requests to the Spring Boot backend. 
- **API Communication:** All external data fetching routes through these files.
- **Backend Integration:** Services interact with endpoints like `/api/v1/assets` and parse standard backend response wrappers.

### `src/hooks/`
Contains custom React hooks for localized logic separation, standardizing features like fetching data arrays or handling specialized component state.

### `src/auth/`
Handles the **Authentication Flow** and **JWT Storage**.
- Contains the `AuthContext` which manages the current user state across the entire React tree.
- Handles logging in, storing the JWT (typically in `localStorage` or memory), and attaching it to Axios interceptors.
- Contains `ProtectedRoute` components that wrap application routes, ensuring unauthenticated users are redirected to the login page.

### `src/types/`
Contains strict TypeScript interfaces (e.g., `Asset`, `Employee`, `ApiResponse`, `AuthResponseData`). These files are crucial for maintaining type safety and ensuring the frontend models perfectly match the backend DTOs.

### `src/utils/`
Contains helper functions (e.g., date formatting, data transformation) that are used across multiple components or services.

### `src/App.tsx`
The primary React component where **Routing** is defined. It maps URL paths (e.g., `/dashboard`, `/assets`) to their respective page components and wraps protected routes with authentication guards.

### `src/main.tsx`
The main entry point for the React application. It attaches the React tree to the HTML DOM and wraps the app with necessary providers (e.g., `BrowserRouter`, `AuthProvider`, `ToastProvider`).

### `vite.config.ts`
Configuration file for the Vite build tool. Handles port configurations, strict port settings, and proxies (vital for bypassing CORS/SSL errors during development by proxying `/api` requests to the backend URL).

### `package.json`
Defines project metadata, dependencies (like `react`, `axios`, `react-router-dom`), and NPM scripts (such as `dev`, `build`, `preview`).

### `.env.development`
Stores environment-specific variables. Primarily used to store `VITE_API_BASE_URL` (pointing to the backend's localhost address and port) so the application knows where to route API requests without hardcoding URLs.

## 4. Technical Architecture Details

- **Authentication Flow & JWT Storage:** Users submit credentials to `/auth/login`. On success, the backend returns a JWT. The frontend's `AuthContext` stores this token in `localStorage` and maintains the user state. An Axios interceptor automatically attaches `Authorization: Bearer <token>` to all subsequent outgoing API requests. If a `401 Unauthorized` response is received, the interceptor triggers a logout and redirects to `/login`.
- **Routing:** Handled by `react-router-dom`. Routes are defined in `App.tsx` and wrapped within a layout.
- **State Handling:** Application-wide state (like user auth) uses React Context. Local UI state and fetched data are generally handled using `useState` and `useEffect` within pages and components.

---

## 5. SYSTEM ARCHITECTURE

```text
Frontend:
React + Vite + TypeScript
        |
        | HTTPS REST API + JWT
        |
Backend:
Spring Boot 3.2
        |
        |
MySQL 8 Database
```

**Authentication flow:**
```text
Login
 ↓
Spring Security
 ↓
JWT Token
 ↓
Protected APIs
```

---

## 6. CURRENT FEATURE STATUS

**Completed:**
- JWT Authentication
- BCrypt password security
- Asset CRUD
- Employee CRUD (with proper status and phone fields)
- Asset Assignment
- Asset Return
- Dashboard Statistics API & Recharts Visualization
- Employee Assigned Assets View
- Pagination
- Search/filtering
- Soft Delete
- QR Code support
- Global Exception Handling
- Standard API Response Wrapper
- Vendor Management
- Maintenance Module
- Excel Report Export
- QR Code Public Tracking View

- Role-Based Access Control (RBAC): `ADMIN`, `EMPLOYEE`, `VIEWER` roles.
- Route Protection: `ProtectedRoute` supports `allowedRoles` array.
- UI Conditional Rendering: `VIEWER` role has action buttons (Create/Edit/Delete/Assign) hidden across all modules.
- Warranty Alerts Widget (Dashboard): Color-coded alerts (Red < 7 days, Orange 7-30 days).
- Warranty Alerts & Expiry Filter (7, 30, 60, 90, 120 days).
- Full Name display on UI (Welcome Message Integration)

**Pending:**
- PDF Reports
- Production Deployment

---

## 7. API CONTRACT RULES

All backend responses follow this standardized wrapper format:
```json
{
  "success": true,
  "message": "Success message or error detail",
  "data": { ... },
  "timestamp": "2026-06-18T12:00:00.000Z"
}
```
- Frontend must unwrap the `data` field.
- Frontend should not assume raw API responses.
- JWT token is sent using the header:
  `Authorization: Bearer <token>`

---

## 8. DATABASE RELATIONSHIP OVERVIEW

```text
Employee
 |
 | One-to-Many
 |
AssetAssignment
 |
 | Many-to-One
 |
Asset
```
- AssetAssignment stores history.
- One asset can have multiple historical assignments.
- Only one active assignment exists at a time.

---

## 9. DEVELOPMENT COMMANDS

**Frontend:**
```bash
cd ams-frontend
npm install
npm run dev
```

**Full Stack Launcher (Windows/WSL):**
To start the database (WSL), Redis (WSL), Backend (WSL), and Frontend (Windows) simultaneously, use the provided batch script in the root directory:
```cmd
cd ..
start-ams.bat
```

---

## 10. KNOWN DEVELOPMENT NOTES

- Backend uses HTTPS with self-signed certificate.
- Frontend uses Vite proxy for development SSL handling.
- JWT authentication is stateless.
- TypeScript interfaces must match backend DTOs.
- Do not change API response format without updating frontend.

---

## 11. AI DEVELOPER NOTES

When modifying this project:
- Preserve existing architecture.
- Avoid replacing JWT/security implementation.
- Avoid unnecessary dependencies.
- Test backend APIs before frontend changes.
- Follow existing folder/module structure.

After updating:
- Verify CODEBASE.md matches actual files.
- Ensure formatting is clean Markdown.
- Do not touch anything except CODEBASE.md files.
