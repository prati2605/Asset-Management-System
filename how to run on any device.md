# Railway AMS (Asset Management System)

This repository contains the complete full-stack Asset Management System, including the React Frontend, Spring Boot Backend, and MySQL database configuration. 

This guide provides instructions on how to run the project in two ways:
1. **Using Docker (Recommended)** - For running the full stack easily on *any* device.
2. **Local Development Mode** - For running the frontend, backend, and database individually.

---

## 🚀 Option 1: Run the Full Project on ANY Device (Docker)

This is the easiest way to run the project. It automatically sets up the database, backend API, and frontend UI in isolated containers without requiring you to install Node, Java, or MySQL on your host machine.

### Prerequisites
- [Docker](https://www.docker.com/get-started) and Docker Compose installed.

### Steps
1. Open a terminal and navigate to the root directory of this project.
2. Run the following command to build and start all services in the background:
   ```bash
   docker-compose up --build -d
   ```
3. That's it! Wait a minute for the containers to initialize.
   - **Frontend UI:** `http://localhost` (or `http://localhost:80` depending on your OS)
   - **Backend API:** `http://localhost:8081`
   - **Database:** `localhost:3306`

*To stop the project, run: `docker-compose down`*

---

## 💻 Option 2: Run Individually (Local Development)

If you want to modify the code and see real-time updates, you should run the services individually on your host machine.

### Prerequisites
- **Node.js** (v18+)
- **Java 17** and **Maven**
- **MySQL 8** (Running locally or in WSL)

### 1. Database Setup
Ensure MySQL is running on your local machine on port `3306`.
1. Create a database named `ams_db`.
2. Create a user `ams_user` with password `ams_password` and grant them privileges to `ams_db`.
3. (Optional) Import the `seed-demo-data.sql` script located in the root directory to populate the database with dummy data.

### 2. Run the Backend (Spring Boot)
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd ams-backend/ams-backend
   ```
2. Start the Spring Boot server using Maven:
   ```bash
   mvn spring-boot:run
   ```
3. The backend will start on `http://localhost:8081`. 

*(Note for Windows users: If you experience "Communications link failure" when connecting to a WSL MySQL instance, try running this Maven command directly inside a WSL terminal).*

### 3. Run the Frontend (React / Vite)
1. Open a terminal and navigate to the frontend directory:
   ```bash
   cd ams-frontend
   ```
2. Install the Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. The frontend will start on `http://localhost:8082`.

---

## 🔑 Default Login Credentials

Once the application is running, you can log in using the following test accounts:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@railway.com` | `Admin@123` |
| **Employee** | `sneha@railway.com` | `Admin@123` |
| **Viewer** | `priya@railway.com` | `Admin@123` |
