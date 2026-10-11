# CampusConnect – College Event Management System
> *"Connect • Participate • Celebrate"*

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg)](https://vitejs.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)]()

**CampusConnect** is a modern, responsive, full-stack enterprise-grade web application engineered to centralize and automate college event management. It replaces error-prone manual paperwork and physical registration desks with a real-time, role-governed platform connecting students, faculty organizers, and institutional administrators.

---

## 📑 Table of Contents
1. [Key Features by Role](#-key-features-by-role)
2. [Technology Stack](#-technology-stack)
3. [System Architecture](#-system-architecture)
4. [Database Design](#-database-design)
5. [Default Test Credentials](#-default-test-credentials)
6. [Getting Started & Setup Guide](#-getting-started--setup-guide)
7. [REST API Documentation](#-rest-api-documentation)
8. [Business Rules Enforced](#-business-rules-enforced)
9. [Screenshots & UI Showcase](#-screenshots--ui-showcase)
10. [Future Enhancements](#-future-enhancements)

---

## 🎯 Key Features by Role

### 1. 🎓 Student Experience
* **Discovery & Search**: Browse live campus events with multi-faceted filtering (Category, Status, Keyword, Venue, and Sorting by Date, Latest, Popular).
* **Detailed Event Briefings**: View rich banners, event agendas, milestone timelines, venue locations, remaining seats, and organizer contacts.
* **1-Click Self Registration**: Instant registration with real-time seat decrementing and automated deadline validation.
* **Personal Dashboard**: Track active registrations, upcoming schedule, and completed events.
* **Registration Lifecycle**: Cancel registrations with seat auto-restoration; view historical participation records.
* **Profile Management**: Maintain personal contact information and institutional student ID.

### 2. 💼 Faculty & Club Organizer Experience
* **Organizer Dashboard**: Live counters for total events, upcoming activities, attendee registrations, and completed events.
* **Event Creation & Publication**: Create events with high-resolution image presets, category tags, maximum seat capacities, and registration cut-off deadlines.
* **Event Lifecycle Management**: Edit event details, reschedule, mark ongoing/completed, or cancel events.
* **Agenda & Activities Builder**: Break down events into granular session timelines with dedicated venues and timings.
* **Attendee Roster Management**: Search and filter attendees by status; check-in participants (mark as `ATTENDED`); export rosters to CSV for offline coordination.

### 3. 🛡️ Administrator Governance
* **Executive Dashboard**: System-wide analytics with visual metric distributions (Events by Category, Event Status breakdown, and User Distribution).
* **Comprehensive User Directory**: Search, inspect, edit, activate/deactivate, and safely delete student, organizer, or admin accounts.
* **Global Event Governance**: Oversee all college events, modify records, remove inappropriate content, or cancel events.
* **System Records Audit**: Complete visibility into all event registrations across the university.

---

## 🛠 Technology Stack

### Backend
* **Language / Platform**: Java (JDK 17+)
* **Framework**: Spring Boot 3.3.4
* **Web Services**: Spring Web (RESTful APIs)
* **Persistence & ORM**: Spring Data JPA & Hibernate
* **Security & Auth**: Spring Security 6 & JWT (JSON Web Tokens via JJWT 0.11.5)
* **Password Hashing**: BCrypt with salted rounds
* **Validation**: Jakarta Bean Validation (`@Valid`, `@NotNull`, `@NotBlank`, `@Email`)
* **Build Tool**: Apache Maven

### Frontend
* **Core Library**: React.js (v18.3)
* **Build Tool**: Vite (Lightning fast HMR & production bundler)
* **Routing**: React Router DOM (v6.26)
* **API Client**: Axios (configured with automated JWT interceptors and error handling)
* **Icons**: Lucide React
* **Styling**: Modern CSS3 Custom Properties (Design System with rounded cards, soft glassmorphism shadows, and responsive grid layouts)

### Database
* **RDBMS**: MySQL 8.0+
* **Database Name**: `college_event_management`

---

## 🏛 System Architecture

CampusConnect follows a standard, decoupled Controller-Service-Repository multi-tier architecture:

```
[ Client Browser (React + Vite) ]
                │
         HTTPS / REST (JSON)
                │
                ▼
┌──────────────────────────────────────────────────────────┐
│                   Spring Boot Backend                    │
│                                                          │
│  [ JwtAuthenticationFilter & SecurityConfig (CORS/CSRF)] │
│                           │                              │
│                           ▼                              │
│                   [ REST Controllers ]                   │
│   (AuthController, EventController, RegistrationCtrl...) │
│                           │                              │
│                           ▼                              │
│                    [ Service Layer ]                     │
│  (AuthService, EventService, RegistrationService...)     │
│                           │                              │
│                           ▼                              │
│                 [ Data Access (JPA) ]                    │
│  (UserRepository, EventRepository, RegistrationRepo...)  │
└───────────────────────────┬──────────────────────────────┘
                            │
                      JDBC (Port 3306)
                            │
                            ▼
               [ MySQL Database (college_event_management) ]
```

---

## 🗄 Database Design

### 1. `users` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| `name` | VARCHAR(100) | NOT NULL | Full name of the user |
| `email` | VARCHAR(100) | NOT NULL, UNIQUE | Institutional email address |
| `phone` | VARCHAR(20) | NULL | Contact phone number |
| `college_id` | VARCHAR(50) | NULL | College / Student ID card number |
| `password` | VARCHAR(255) | NOT NULL | BCrypt-encrypted password |
| `role` | VARCHAR(20) | NOT NULL | `STUDENT`, `ORGANIZER`, `ADMIN` |
| `status` | VARCHAR(20) | NOT NULL | `ACTIVE`, `INACTIVE` |
| `created_at` | DATETIME | NULL | Timestamp of account registration |

### 2. `events` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique event identifier |
| `title` | VARCHAR(150) | NOT NULL | Event title |
| `description` | TEXT | NULL | Detailed event description |
| `category` | VARCHAR(50) | NOT NULL | `Technical`, `Cultural`, `Workshop`, `Seminar`, `Sports`, `Competition`, `Fest` |
| `venue` | VARCHAR(150) | NOT NULL | Campus venue / Hall |
| `event_date` | DATE | NOT NULL | Date of the event |
| `start_time` | VARCHAR(20) | NULL | Starting time |
| `end_time` | VARCHAR(20) | NULL | Ending time |
| `organizer_id` | BIGINT | NOT NULL, FK(`users.id`) | Event organizer reference |
| `max_participants`| INT | NOT NULL | Maximum seat capacity |
| `registration_deadline` | DATE | NOT NULL | Registration cut-off date |
| `image_url` | VARCHAR(500) | NULL | Event promotional banner image |
| `status` | VARCHAR(20) | NOT NULL | `UPCOMING`, `ONGOING`, `COMPLETED`, `CANCELLED` |
| `created_at` | DATETIME | NULL | Creation timestamp |

### 3. `registrations` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique registration ID |
| `student_id` | BIGINT | NOT NULL, FK(`users.id`) | Registered student reference |
| `event_id` | BIGINT | NOT NULL, FK(`events.id`) | Event reference |
| `registration_date` | DATETIME | NOT NULL | Timestamp of registration |
| `status` | VARCHAR(20) | NOT NULL | `REGISTERED`, `CANCELLED`, `ATTENDED` |

*Note: Unique constraint on `(student_id, event_id)` prevents double registration.*

### 4. `event_activities` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Activity item ID |
| `event_id` | BIGINT | NOT NULL, FK(`events.id`) | Parent event reference |
| `activity_name` | VARCHAR(150) | NOT NULL | Name of the session/activity |
| `description` | TEXT | NULL | Session briefing |
| `activity_time` | VARCHAR(50) | NULL | Timing range |
| `venue` | VARCHAR(150) | NULL | Specific hall or lab |

---

## 🔑 Default Test Credentials

The system includes pre-configured demo users seeded automatically by Spring Boot's `DataInitializer` upon startup:

| Role | Email | Password | Display Name |
|---|---|---|---|
| **Admin** | `admin@campusconnect.com` | `admin123` | System Admin |
| **Organizer** | `organizer@campusconnect.com` | `organizer123` | Prof. Alex Morgan |
| **Organizer (Tech)**| `techclub@campusconnect.com` | `organizer123` | Elena Gilbert (Tech Club) |
| **Student** | `student@campusconnect.com` | `student123` | John Doe |
| **Student** | `sarah@campusconnect.com` | `student123` | Sarah Connor |

> 💡 **Quick-Fill Feature**: The Login page features quick-fill buttons so you can test all 3 roles with a single click.

---

## 🚀 Getting Started & Setup Guide

### Prerequisites
* **Java**: JDK 17 or higher (`java -version`)
* **Maven**: Maven 3.8+ (`mvn -version`)
* **Node.js**: Node 18+ and npm (`node -v`, `npm -v`)
* **MySQL**: MySQL 8.0+ running on port 3306

---

### Step 1: Database Setup
1. Ensure your MySQL service is running.
2. The database `college_event_management` will be automatically created if it doesn't exist, or you can create it manually:
```sql
CREATE DATABASE IF NOT EXISTS college_event_management;
```
3. Configure `backend/src/main/resources/application.properties` with your MySQL credentials:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/college_event_management?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=root
```

---

### Step 2: Run the Spring Boot Backend
Open a terminal in the project directory:

```bash
cd backend
mvn spring-boot:run
```

* Backend server will start at: **`http://localhost:8080`**
* Test seed data will be populated automatically on first boot.

---

### Step 3: Run the React Frontend
Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

* Frontend application will start at: **`http://localhost:5173`**

---

## 📡 REST API Documentation

### 1. Authentication (`/api/auth`)
* `POST /api/auth/register` - Create student or organizer account
* `POST /api/auth/login` - Authenticate and receive JWT token
* `GET /api/auth/me` - Retrieve authenticated user profile

### 2. Events (`/api/events`)
* `GET /api/events` - Browse events with filters (`search`, `category`, `status`, `sort`)
* `GET /api/events/{id}` - Get single event details with activities and capacity
* `POST /api/events` - Create event (*ORGANIZER / ADMIN*)
* `PUT /api/events/{id}` - Edit event (*Event Organizer / ADMIN*)
* `DELETE /api/events/{id}` - Delete event (*Event Organizer / ADMIN*)
* `PUT /api/events/{id}/cancel` - Cancel event (*Event Organizer / ADMIN*)
* `GET /api/events/category/{category}` - Filter events by category
* `GET /api/events/organizer/{organizerId}` - Fetch events by organizer
* `GET /api/events/stats/organizer/{organizerId}` - Fetch organizer metrics

### 3. Registrations (`/api/registrations`)
* `POST /api/registrations` - Register current student for an event
* `GET /api/registrations/my` - Get current student's registered events
* `GET /api/registrations/event/{eventId}` - View participant roster for an event (*ORGANIZER / ADMIN*)
* `DELETE /api/registrations/{id}` - Cancel an event registration
* `PUT /api/registrations/{id}/status` - Update attendee status (e.g., mark `ATTENDED`) (*ORGANIZER / ADMIN*)
* `GET /api/registrations` - View all registrations (*ADMIN*)

### 4. User Management (`/api/users`)
* `GET /api/users` - List all users (*ADMIN*)
* `GET /api/users/{id}` - Get user profile
* `PUT /api/users/{id}` - Update user profile
* `DELETE /api/users/{id}` - Delete user account (*ADMIN*)
* `PUT /api/users/{id}/status` - Toggle user `ACTIVE`/`INACTIVE` status (*ADMIN*)
* `GET /api/users/stats/admin` - Executive metrics for admin dashboard (*ADMIN*)

### 5. Event Activities (`/api/activities`)
* `POST /api/activities` - Add activity to an event (*ORGANIZER / ADMIN*)
* `GET /api/activities/event/{eventId}` - Get activity schedule for an event
* `PUT /api/activities/{id}` - Update activity
* `DELETE /api/activities/{id}` - Delete activity

---

## ⚖️ Business Rules Enforced

1. **Duplicate Prevention**: A student cannot register more than once for the same event (`(student_id, event_id)` uniqueness enforced in database and service layer).
2. **Deadline Enforcement**: Registration attempts after the `registration_deadline` are blocked with a clear notice.
3. **Capacity Constraints**: When registered count reaches `max_participants`, further registrations are refused with a "Housefull" state.
4. **Cancelled & Completed Invariance**: Cancelled or completed events do not accept new registrations.
5. **Ownership Isolation**: Organizers can only edit, modify, and delete events created by themselves (administrators hold global override privileges).
6. **Role Isolation**: Students cannot access organizer or admin endpoints or perform elevated actions.
7. **Identity Uniqueness**: Email address and student College IDs must be unique across the system.
8. **Cascading Integrity**: Account deletion safely purges orphaned registrations and activities.

---

## 🔮 Future Enhancements
* Automated QR Code generation on registration for barcode scanning at venue check-in desks.
* Automated certificate of participation PDF generation for students marked as `ATTENDED`.
* Email / SMS reminders 24 hours prior to event start times.
* Online payment gateway integration for paid workshops or conferences.
