# Corporate Performance Management Platform

A robust backend for a Corporate Performance Management Platform built with NestJS and PostgreSQL.

## Features

- User management with role-based access control (Admin, Manager, Employee)
- KPI definition, assignment, and tracking
- OKR cycle management with goal-setting and review processes
- 360-degree feedback collection and analysis
- Performance analytics and reporting
- Export functionality for performance summaries (PDF/Excel)

## Tech Stack

- **Backend**: NestJS
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT
- **Documentation**: Swagger/OpenAPI
- **Export Formats**: Excel, PDF

## Getting Started

### Prerequisites

- Node.js (v14+)
- PostgreSQL (v12+)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Configure environment variables in `.env` file:

```
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=performance_management

# JWT Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=1d

# Application
PORT=3000
NODE_ENV=development
```

4. Start the application:

```bash
npm run start:dev
```

5. Seed the database with initial data:

```bash
npm run seed
```

## API Documentation

The API documentation is available at `http://localhost:3000/api` when the application is running.

## Database Models

- **Users**: User management with role-based access control
- **KPIs**: Key Performance Indicators
- **OKRs**: Objectives and Key Results
- **Feedback**: 360-degree feedback system
- **Performance Reviews**: Employee performance evaluations

## Authentication

The API uses JWT for authentication. To access protected endpoints, include a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Default Users

After seeding the database, the following users are available:

- **Admin**: admin@example.com / admin123
- **Manager**: manager@example.com / manager123
- **Employees**:
  - employee1@example.com / employee123
  - employee2@example.com / employee123

## License

This project is licensed under the MIT License.