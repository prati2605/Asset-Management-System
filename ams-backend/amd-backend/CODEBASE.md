# Railway Asset Management System (AMS) - Backend Codebase Documentation

## 1. Project Overview
- **Project Name:** Railway Asset Management System (AMS) - Backend
- **Purpose:** A robust RESTful API backend designed to manage railway physical assets, handle employee data, and manage the lifecycle of asset assignments and returns.
- **Technology Stack:** Java 17, Spring Boot 3.x, Spring Security 6, Spring Data JPA, Hibernate, MySQL, JWT (JSON Web Tokens).
- **Architecture Summary:** The backend employs a standard layered N-tier architecture common in Spring Boot applications. It separates concerns into Controllers (handling HTTP requests), Services (business logic and transaction management), Repositories (database access layers), and Entities (object-relational mapping models). Security is managed statelessly using a custom JWT authentication filter.

## 2. Folder and File Tree Structure
```text
ams-backend/
├── src/
│   ├── main/
│   │   ├── java/com/ecr/ams/
│   │   │   ├── common/            # Shared DTOs, API wrappers, utility classes
│   │   │   ├── config/            # Application-wide configurations (e.g., OpenAPI, Beans)
│   │   │   ├── exception/         # Custom exception classes and Global Exception Handler
│   │   │   ├── modules/           # Core feature modules grouped by domain
│   │   │   │   ├── asset/         # Asset entities, repositories, services, controllers
│   │   │   │   ├── assetassignment/ # Assignment logic linking employees and assets
│   │   │   │   ├── dashboard/     # Aggregation services for KPI statistics
│   │   │   │   ├── employee/      # Employee domain logic
│   │   │   │   └── system/        # User accounts and core system domains
│   │   │   ├── security/          # JWT utilities, Auth filters, Spring Security config
│   │   │   └── AmsApplication.java # Spring Boot main application class
│   │   └── resources/
│   │       ├── application.yml    # Main configuration properties (Ports, DB, JWT)
│   │       └── keystore.p12       # SSL Certificate for HTTPS (if applicable)
├── pom.xml                        # Maven project object model, dependencies, and plugins
└── README.md
```
*(Note: Generated folders like `target` are omitted.)*

## 3. Important Directories and Files Explained

### `src/main/java/` Structure
The source root follows domain-driven packaging under `com.ecr.ams.modules`, where each major feature (Asset, Employee, etc.) has its own isolated package containing its MVC layers.

### Controllers
Located within module packages (e.g., `AssetController`). These classes define the REST endpoints, map HTTP methods (GET, POST, etc.) to service methods, and handle request/response data binding. They enforce route-level authorization (e.g., `@PreAuthorize`).

### Services
Interfaces and their implementations (e.g., `AssetServiceImpl`) that house the core business logic. They are annotated with `@Service` and manage database transactions via `@Transactional`.

### Repositories
Interfaces extending Spring Data's `JpaRepository`. They handle data access abstraction. Custom queries are defined here using Spring Data method naming conventions or `@Query` annotations.

### Entities
Located in the module domains, these classes (annotated with `@Entity`) represent database tables. They define columns, constraints, and relationships using JPA annotations.

### DTOs (Data Transfer Objects)
Used to pass data between the client and server without exposing internal database entities. They are heavily utilized in requests and responses to ensure data security and shape enforcement.

### Security
The `security/` package configures Spring Security. 
- Contains `SecurityConfig.java` defining CORS rules, public/protected routes, and the filter chain.
- Contains `JwtAuthenticationFilter` to intercept requests, validate the JWT token, and inject user details into the Spring Security Context.
- Contains utilities for token generation and parsing.

### Config
Contains configuration classes (`@Configuration`). This often includes global CORS configurations, OpenAPI/Swagger bean setups, or custom model mapper beans.

### Exception Handling
The `exception/` package contains a `@RestControllerAdvice` annotated class. It intercepts exceptions thrown anywhere in the application (like `ResourceNotFoundException`) and formats them into a standardized JSON response, ensuring the frontend receives clean error messages rather than raw stack traces.

### Resources (`src/main/resources/`)
Contains `application.yml` or `application.properties`. This file holds critical runtime configurations: server ports, database connection strings (JDBC URLs), JPA/Hibernate settings (like `ddl-auto`), and secret keys (e.g., JWT signing keys).

### `pom.xml`
The Maven build configuration. It lists all project dependencies (Spring Web, Spring Data JPA, MySQL Driver, JWT libraries) and build plugins required to compile and package the application.

## 4. Technical Architecture Details

- **Spring Boot Architecture:** Follows the Controller -> Service -> Repository flow. Dependency Injection is heavily utilized to decouple components.
- **Database Connection:** Configured via `application.yml` to connect to a MySQL instance using the HikariCP connection pool. Hibernate acts as the JPA provider, mapping Java objects to SQL tables.
- **JWT Authentication:** Completely stateless. On a successful login, the server generates a signed JWT. Subsequent requests must include this token in the `Authorization: Bearer` header. The security filter verifies the signature and expiration before allowing access.
- **Role-Based Access:** Managed via Spring Security's `@PreAuthorize("hasRole('ADMIN')")` annotations, ensuring only authorized personnel can perform sensitive operations.
- **Asset Module:** Handles creation, reading, updating, and deletion (CRUD) of physical railway assets.
- **Employee Module:** Manages staff records.
- **Assignment Module:** A transactional module that assigns an `Asset` to an `Employee`. It changes the asset's status to `ASSIGNED` and logs the checkout date.
- **Dashboard API:** A read-only service that aggregates data across repositories to provide high-level KPIs (total assets, active employees, etc.) for the frontend dashboard.
- **Soft Delete:** Implemented using Hibernate's `@SQLDelete` and `@Where` annotations on entities. When a delete operation is called, a boolean `deleted` flag is set rather than physically removing the row from the database, preserving historical assignment data.
- **Validation:** Uses Jakarta Bean Validation (`@Valid`, `@NotNull`, `@NotBlank`) on DTOs to ensure incoming payload integrity before reaching the business logic.

## 5. API Documentation

- **Base URL:** `http://localhost:8081/api/v1` (or `https://` if SSL is enabled)
- **Authentication Method:** JWT via HTTP `Authorization: Bearer <token>` header.

**Important Endpoints:**
- `POST /auth/login`: Authenticates user and returns JWT. (Public)
- `GET /assets`: Retrieves paginated assets.
- `POST /assets`: Creates a new asset.
- `GET /employees`: Retrieves paginated employees.
- `GET /dashboard/stats`: Aggregates KPI statistics for the dashboard.
- `POST /assets/{id}/assign/{employeeId}`: Assigns an asset to an employee.
- `POST /assets/{id}/return`: Returns an assigned asset to inventory.

---

## 6. SYSTEM ARCHITECTURE

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

## 7. CURRENT FEATURE STATUS

**Completed:**
- JWT Authentication
- BCrypt password security
- Asset CRUD
- Employee CRUD
- Asset Assignment
- Asset Return
- Dashboard Statistics API
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
- Warranty Alerts API
- Full Name display in AuthResponse (Welcome Message Integration)
- Role-Based Access Control (RBAC): Added `@EnableMethodSecurity` and `@PreAuthorize` globally. Write endpoints restricted to `ADMIN` and `EMPLOYEE`. `VIEWER` restricted to read-only endpoints.
- JWT: Token generation updated to inject the user's `role`.
- SecurityConfig: Route protection rules tightened.

**Pending:**
- PDF Reports
- Production Deployment

---

## 8. API CONTRACT RULES

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

## 9. DATABASE RELATIONSHIP OVERVIEW

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

## 10. DEVELOPMENT COMMANDS

**Backend:**
```bash
cd ams-backend

mvn spring-boot:run

# or

java -jar target/*.jar
```

**Full Stack Launcher (Windows/WSL):**
To start the database (WSL), Redis (WSL), Backend (WSL), and Frontend (Windows) simultaneously, use the provided batch script in the root directory:
```cmd
cd ..
start-ams.bat
```
Ensure WSL services (MySQL, Redis) are configured to start without password prompts.

---

## 11. KNOWN DEVELOPMENT NOTES

- Backend uses HTTPS with self-signed certificate.
- Frontend uses Vite proxy for development SSL handling.
- JWT authentication is stateless.
- TypeScript interfaces must match backend DTOs.
- Do not change API response format without updating frontend.

---

## 12. AI DEVELOPER NOTES

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
