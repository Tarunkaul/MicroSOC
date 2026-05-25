# 🛡️ MicroSOC - Security Operations Center Dashboard

<div align="center">

![MicroSOC Logo](https://img.shields.io/badge/MicroSOC-Security%20Dashboard-blue?style=for-the-badge&logo=shield&logoColor=white)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

**A real-time cybersecurity threat monitoring and incident management platform**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Setup](#-setup-instructions) • [API Docs](#-api-documentation) • [Screenshots](#-screenshots)

</div>

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Problem Statement](#-problem-statement)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Setup Instructions](#-setup-instructions)
- [Screenshots](#-screenshots)
- [Error Handling](#-error-handling--reliability)
- [Team](#-team)
- [Future Improvements](#-future-improvements)

---

## 🎯 Project Overview

**MicroSOC** is a comprehensive Security Operations Center (SOC) dashboard that provides real-time threat monitoring, incident management, and security analytics. Built with modern web technologies, it simulates a professional SOC environment where security analysts can monitor, analyze, and respond to cybersecurity threats.

The platform features:
- **Real-time threat detection** with live attack log ingestion
- **Interactive dashboards** with dynamic charts and visualizations
- **Role-based access control** (Admin & Analyst roles)
- **Dark/Light mode** for comfortable viewing in any environment
- **Threat intelligence integration** with external APIs (AbuseIPDB)
- **Advanced filtering and log management** capabilities

---

## 🔍 Problem Statement

**PS Number:** 6

### Challenge
Modern organizations face an overwhelming volume of security events daily. Security teams need:
1. **Centralized monitoring** - A single pane of glass for all security events
2. **Real-time detection** - Immediate visibility into active threats
3. **Efficient triage** - Quick severity classification and prioritization
4. **Actionable intelligence** - Enriched threat data for informed decision-making
5. **Collaborative response** - Role-based workflows for team coordination

### Solution
MicroSOC addresses these challenges by providing:
- Automated log ingestion and parsing
- Real-time threat visualization with severity-based classification
- Integration with threat intelligence feeds
- Role-based access control for team collaboration
- Comprehensive incident management workflow

---

## ✨ Features

### 🔐 Authentication & Authorization
- **Secure Login/Signup** with JWT-based authentication
- **Role-Based Access Control (RBAC)**
  - **Admin**: Full system access, log purging, IP banning
  - **Analyst**: View logs, update incident status
- **Session management** with automatic token refresh
- **Password hashing** using bcrypt

### 📊 Dashboard & Visualization
- **Real-time Attack Trends** - 30-minute rolling window line chart
- **Severity Distribution** - Interactive donut chart
- **Live Event Feed** - Auto-refreshing top 5 recent incidents
- **Dynamic Metrics** - Active threat counts by severity
- **Responsive Design** - Works on desktop, tablet, and mobile

### 🌓 Theme System
- **Dark/Light Mode Toggle** - Seamless theme switching
- **Persistent Preferences** - Theme saved in localStorage
- **Smooth Transitions** - 300ms animated color changes
- **Consistent Theming** - Applied across all pages

### 📝 Log Management
- **Automated Log Ingestion** - Kaiju script generates realistic attack logs
- **Comprehensive Log View** - All logs page with full details
- **Status Management** - Update logs (Open → In Progress → Resolved)
- **Filtering & Sorting** - By severity, status, timestamp
- **Log Purging** - Admin-only system reset capability

### 🚨 Threat Intelligence
- **AbuseIPDB Integration** - Real-time IP reputation checks
- **Enriched Data** - Country, ISP, confidence scores
- **IP Banning** - Admin can block malicious IPs
- **Threat Classification** - Automatic severity assignment

### 🎨 User Experience
- **Intuitive Interface** - Clean, modern design
- **Interactive Charts** - Hover tooltips with detailed data
- **Live Updates** - 2-second auto-refresh intervals
- **Visual Feedback** - Loading states, success/error messages
- **Accessibility** - ARIA labels

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React.js** | 18.3.1 | UI framework |
| **React Router** | 7.1.1 | Client-side routing |
| **Vite** | 6.0.5 | Build tool & dev server |
| **CSS3** | - | Styling with CSS variables |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | Latest | Runtime environment |
| **Express.js** | 4.21.2 | Web framework |
| **PostgreSQL** | Latest | Relational database |
| **pg** | 8.13.1 | PostgreSQL client |

### Security & Authentication
| Technology | Version | Purpose |
|------------|---------|---------|
| **bcrypt** | 5.1.1 | Password hashing |
| **jsonwebtoken** | 9.0.2 | JWT authentication |
| **dotenv** | 16.4.7 | Environment variables |

### External APIs
| Service | Purpose |
|---------|---------|
| **AbuseIPDB** | IP reputation & threat intelligence |

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Auth Page  │  │  Dashboard   │  │  Ingest Page │      │
│  │  (Login/     │  │  (Analytics) │  │  (All Logs)  │      │
│  │   Signup)    │  │              │  │              │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                  │               │
│         └─────────────────┴──────────────────┘               │
│                           │                                  │
│                    React Router                              │
│                    Theme Context                             │
└───────────────────────────┬─────────────────────────────────┘
                            │
                    HTTP/REST API
                            │
┌───────────────────────────┴─────────────────────────────────┐
│                       SERVER LAYER                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Express.js API Server                   │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │   │
│  │  │   Auth     │  │    Logs    │  │   Admin    │    │   │
│  │  │  Routes    │  │   Routes   │  │   Routes   │    │   │
│  │  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘    │   │
│  │        │               │               │            │   │
│  │  ┌─────┴───────────────┴───────────────┴──────┐    │   │
│  │  │         Middleware Layer                    │    │   │
│  │  │  • JWT Verification                         │    │   │
│  │  │  • Role-Based Access Control                │    │   │
│  │  │  • Error Handling                           │    │   │
│  │  └─────────────────┬───────────────────────────┘    │   │
│  └────────────────────┼──────────────────────────────┘   │
│                       │                                    │
│  ┌────────────────────┴──────────────────────────────┐   │
│  │           External API Integration                │   │
│  │  • AbuseIPDB (Threat Intelligence)                │   │
│  └───────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                    PostgreSQL Protocol
                            │
┌───────────────────────────┴─────────────────────────────────┐
│                      DATABASE LAYER                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                PostgreSQL Database                   │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │   │
│  │  │   users    │  │attack_logs │  │ banned_ips │    │   │
│  │  │  table     │  │   table    │  │   table    │    │   │
│  │  └────────────┘  └────────────┘  └────────────┘    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                    Automated Scripts
                            │
┌───────────────────────────┴─────────────────────────────────┐
│                     AUTOMATION LAYER                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Kaiju.js - Attack Log Generator                    │   │
│  │  • Simulates XSS, SQLi, DDoS attacks                │   │
│  │  • Enriches with AbuseIPDB data                     │   │
│  │  • Inserts into database                            │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Authentication Flow**
   ```
   User → Login Form → POST /api/auth/signin → JWT Token → localStorage → Protected Routes
   ```

2. **Log Ingestion Flow**
   ```
   Kaiju Script → Generate Attack → AbuseIPDB API → Enrich Data → PostgreSQL → Dashboard
   ```

3. **Real-time Updates Flow**
   ```
   Dashboard → setInterval(2s) → GET /api/logs → Update State → Re-render Charts
   ```

---

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/Tarun-1009/MicroSOC.git
cd MicroSOC
```

### 2. Database Setup

#### Install PostgreSQL
- **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/)
- **Mac**: `brew install postgresql`
- **Linux**: `sudo apt-get install postgresql`

#### Create Database
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE microsoc;

# Exit
\q
```

#### Create Tables
```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'analyst',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attack logs table
CREATE TABLE attack_logs (
    log_id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    source_ip VARCHAR(45) NOT NULL,
    attack_type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'Open',
    country VARCHAR(100),
    isp VARCHAR(255),
    confidence_score INTEGER
);

-- Banned IPs table
CREATE TABLE banned_ips (
    id SERIAL PRIMARY KEY,
    ip_address VARCHAR(45) UNIQUE NOT NULL,
    banned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason TEXT
);
```

### 3. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=microsoc
DB_PASSWORD=your_postgres_password
DB_PORT=5432
JWT_SECRET=your_super_secret_jwt_key_here
EOF

# Start the server
npm run dev
```

### 4. Frontend Setup

```bash
# Open new terminal
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```
---

## 🔑 Admin Account Creation

Admin accounts are created directly in the PostgreSQL database. After setting up the database, run this SQL query to create an admin user:

```sql
INSERT INTO users (name, email, password, role) 
VALUES ('Admin User', 'admin@microsoc.com', '$2b$10$hashedPasswordHere', 'admin');
```

**Note**: The password must be bcrypt-hashed. You can hash a password using Node.js: `bcrypt.hashSync('yourPassword', 10)` or create the account via the signup form and manually update the role to 'admin' in the database.

---

### 5. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

### Environment Variables

#### Server (.env)
```env
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=microsoc
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_secret_key
ABUSEIPDB_API_KEY=your_api_key
```

---

## 📸 Screenshots

### 1. Authentication Page (Light Mode)
![Auth Light Mode](screenshots/auth-light.png)
*Clean login/signup interface with sliding panel animation*

### 2. Authentication Page (Dark Mode)
![Auth Dark Mode](screenshots/auth-dark.png)
*Dark theme with improved contrast and visibility*

### 3. Dashboard - Overview (Light Mode)
![Dashboard Light](screenshots/dashboard-light.png)
*Real-time threat monitoring with interactive charts*

### 4. Dashboard - Overview (Dark Mode)
![Dashboard Dark](screenshots/dashboard-dark.png)
*Dark mode dashboard with smooth color transitions*

### 5. Threat Activity Chart
![Threat Chart](screenshots/threat-chart.png)
*30-minute rolling window showing attack trends*

### 6. Severity Distribution
![Severity Chart](screenshots/severity-chart.png)
*Donut chart visualizing threat severity breakdown*

### 7. All Logs Page
![Ingest Page](screenshots/ingest-page.png)
*Comprehensive log view with status management*

### 8. Admin Controls
![Admin Panel](screenshots/admin-controls.png)
*Admin-only features: purge logs, ban IPs*

### 9. Mobile Responsive
![Mobile View](screenshots/mobile-view.png)
*Fully responsive design for mobile devices*

---

## 🛡️ Error Handling & Reliability

### Frontend Error Handling

#### 1. Network Errors
```javascript
try {
  const response = await fetch('/api/logs');
  if (!response.ok) throw new Error('Network error');
  const data = await response.json();
} catch (error) {
  console.error('Failed to fetch logs:', error);
  // Display user-friendly error message
}
```

#### 2. Authentication Errors
- Automatic token validation
- Redirect to login on 401 errors
- Token refresh mechanism
- Graceful session expiry handling

#### 3. Form Validation
- Client-side validation before submission
- Real-time error feedback
- Prevent duplicate submissions
- Input sanitization

### Backend Error Handling

#### 1. Global Error Handler
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});
```

#### 2. Database Error Handling
- Connection pooling for reliability
- Automatic reconnection on failure
- Transaction rollback on errors
- Query timeout handling

#### 3. API Error Handling
- Rate limiting for external APIs
- Fallback mechanisms
- Graceful degradation
- Retry logic with exponential backoff

### Reliability Features

#### 1. Data Persistence
- PostgreSQL ACID compliance
- Regular database backups
- Data validation before insertion
- Constraint enforcement

#### 2. Performance Optimization
- Smart comparison to prevent unnecessary re-renders
- Debounced API calls
- Lazy loading of components
- Optimized database queries with indexes

#### 3. Security Measures
- SQL injection prevention (parameterized queries)
- XSS protection (input sanitization)
- CSRF token validation
- Rate limiting on API endpoints
- Secure password hashing (bcrypt)
- JWT token expiration

#### 4. Monitoring & Logging
- Console logging for debugging
- Error tracking
- API request logging
- Performance metrics

---

---

## 👥 Team

### ThreeStack Team

| Name | Role | Responsibilities | GitHub |
|------|------|------------------|--------|
| **Tarun Kumar** | Team Lead & Full Stack Developer | • Project architecture<br>• Backend API development<br>• Database design<br>• Integration management | [@Tarun-1009](https://github.com/Tarun-1009) |
| **Tarun Kaul** | Backend Developer | • Server-side logic<br>• Authentication system<br>• API endpoints<br>• Database optimization | [@Tarunkaul](https://github.com/Tarunkaul) |
| **Shri Krishan** | Frontend Developer | • UI/UX design<br>• React components<br>• Theme system<br>• Responsive design | [@Shre-krishan](https://github.com/Shre-krishan) |

---

## 🚧 Future Improvements

- **Enhanced Visualizations**: Heatmap for attack sources, timeline view for incidents, and custom dashboard widgets
- **Advanced Filtering & Export**: Multi-criteria search, saved filter presets, and CSV/JSON export capabilities
- **Real-time Notifications**: Email alerts, webhook integrations, and mobile push notifications for critical threats
- **Machine Learning Integration**: Anomaly detection engine, predictive threat modeling, and automated incident classification
- **Scalability & Mobile**: Microservices architecture, Redis caching, Progressive Web App (PWA), and native mobile applications

---


<div align="center">

**Made with ❤️ by Team ThreeStack**

⭐ Star this repo if you find it helpful!

</div>
