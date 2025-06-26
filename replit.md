# WhatsApp Business Campaign Manager

## Overview

This is a modern 3-tier WhatsApp Business campaign management application with complete separation between frontend and backend. The system allows businesses to connect their WhatsApp Business accounts, create message templates, manage contacts, and run automated marketing campaigns through the WhatsApp Business API.

## System Architecture

### Frontend (Tier 1)
- **Framework**: React 18 with vanilla JavaScript (converted from TypeScript)
- **Build Tool**: Create React App for standard React development
- **UI Components**: Custom CSS-based design system with minimal dependencies
- **Styling**: Pure CSS with custom variables and component classes
- **Icons**: Lucide React (lightweight icon library)
- **Charts**: Chart.js for analytics and data visualization
- **Routing**: React Router DOM for client-side navigation
- **Port**: 3000 (standard React development server)

### Backend (Tier 2)
- **Runtime**: Node.js with Express.js framework
- **Language**: Vanilla JavaScript (converted from TypeScript)
- **Architecture**: MVC pattern with separated controllers and routes
- **Authentication**: Session-based with express-session
- **Security**: Helmet, CORS, rate limiting, bcrypt password hashing
- **API Design**: RESTful API with comprehensive error handling
- **Port**: 3001 (separate from frontend)

### Database (Tier 3)
- **Technology**: MySQL 8.0+ (migrated from PostgreSQL)
- **Query Method**: Raw SQL queries for maximum performance
- **Connection**: mysql2 driver with connection pooling
- **Tables**: Users, campaigns, templates, contacts, messages, webhook_events
- **Schema**: Optimized relational design with proper foreign keys

## Project Structure

### Frontend Structure (`/frontend`)
```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.js       # Top navigation with user menu
│   │   ├── Sidebar.js      # Main navigation sidebar
│   │   └── LoadingSpinner.js # Loading state component
│   ├── pages/              # Page-level components
│   │   ├── Login.js        # Authentication page
│   │   ├── Dashboard.js    # Main overview dashboard
│   │   ├── Campaigns.js    # Campaign management
│   │   ├── Templates.js    # Message template management
│   │   ├── Contacts.js     # Contact database management
│   │   ├── Analytics.js    # Performance analytics with Chart.js
│   │   └── Settings.js     # User and WhatsApp configuration
│   ├── services/           # API communication layer
│   │   └── api.js         # Complete API service with all endpoints
│   ├── styles/            # CSS stylesheets
│   │   └── index.css      # Custom design system with CSS variables
│   ├── App.js             # Main application with routing
│   └── index.js           # Application entry point
└── package.json           # Frontend dependencies
```

### Backend Structure (`/backend`)
```
backend/
├── controllers/            # Request handlers (business logic)
│   ├── user.controller.js # User authentication and profile management
│   ├── campaign.controller.js # Campaign CRUD and execution logic
│   ├── template.controller.js # Template management and approval
│   └── contact.controller.js # Contact management and bulk operations
├── routes/                # Route definitions
│   ├── user.routes.js     # User-related endpoints
│   ├── campaign.routes.js # Campaign management endpoints
│   ├── template.routes.js # Template management endpoints
│   └── contact.routes.js  # Contact management endpoints
├── config/                # Configuration files
│   └── database.js        # MySQL connection and table initialization
├── middleware/            # Custom middleware
│   └── auth.js           # Authentication middleware
├── server.js             # Main Express server setup
└── package.json          # Backend dependencies
```

## Key Features Implemented

### Authentication & Security
- **Session-based Authentication**: Secure user sessions with express-session
- **Password Security**: bcryptjs hashing with salt rounds
- **Input Validation**: Comprehensive validation for all user inputs
- **CORS Protection**: Configured for frontend-backend communication
- **Rate Limiting**: API endpoint protection against abuse
- **Security Headers**: Helmet.js for enhanced security

### WhatsApp Business Integration
- **Facebook Business API**: Complete integration for WhatsApp Business accounts
- **Template Management**: Create, edit, and submit templates for WhatsApp approval
- **Message Delivery**: Send template-based messages through WhatsApp Business API
- **Webhook Handling**: Process delivery receipts and message status updates
- **Business Account Setup**: Guided configuration for WhatsApp credentials

### Campaign Management
- **Campaign Creation**: Link campaigns to approved WhatsApp templates
- **Contact Targeting**: Select specific contact segments for campaigns
- **Campaign Scheduling**: Support for immediate and scheduled campaign execution
- **Status Tracking**: Real-time campaign status monitoring
- **Performance Analytics**: Track delivery rates, response rates, and engagement metrics

### Contact Management
- **Contact Database**: Complete CRUD operations for customer contacts
- **Bulk Import/Export**: CSV-based bulk contact operations
- **Tag-based Segmentation**: Organize contacts with custom tags
- **Opt-in Management**: Track and manage customer consent
- **Search and Filtering**: Advanced contact search and filtering capabilities

### Analytics & Reporting
- **Interactive Charts**: Chart.js integration for visual analytics
- **Campaign Performance**: Detailed metrics for each campaign
- **Message Analytics**: Delivery and read rate tracking
- **Contact Statistics**: Contact growth and engagement metrics
- **Data Export**: CSV export functionality for reports

## Data Flow

1. **Onboarding**: Users connect WhatsApp Business account via Facebook embedded signup
2. **Template Creation**: Users create message templates and submit for WhatsApp approval
3. **Contact Import**: Users upload or manually add contact information
4. **Campaign Setup**: Users create campaigns linking templates to contact segments
5. **Message Delivery**: System sends messages via WhatsApp Business API
6. **Status Tracking**: Webhooks update message delivery and read status
7. **Analytics**: Dashboard displays campaign performance metrics

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form**: Form handling with validation
- **zod**: Schema validation for forms and API

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives for components
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant API for components
- **lucide-react**: Icon library

### WhatsApp/Facebook Integration
- **Facebook Graph API**: WhatsApp Business API access
- **Facebook SDK**: Client-side authentication flow

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Neon PostgreSQL database with development connection
- **Environment Variables**: DATABASE_URL, Facebook app credentials

### Production Deployment
- **Platform**: Replit autoscale deployment
- **Build Process**: Vite build for frontend, esbuild for backend bundling
- **Static Assets**: Frontend built to dist/public, served by Express
- **Database**: Production Neon PostgreSQL instance
- **Environment Variables**: Production Facebook app credentials, DATABASE_URL

## Development Setup

### Backend Development
```bash
cd backend
npm install
cp .env.example .env
# Configure database connection in .env
npm run dev  # Starts on port 3001
```

### Frontend Development
```bash
cd frontend
npm install
npm start    # Starts on port 3000
```

### Database Setup
1. Install MySQL 8.0+
2. Create database for the application
3. Update connection details in `backend/.env`
4. Tables will be created automatically on first run

## Deployment Architecture

### Development Environment
- Frontend: React dev server on localhost:3000
- Backend: Express server on localhost:3001
- Database: Local MySQL instance
- Communication: REST API calls between frontend and backend

### Production Environment
- Frontend: Static build files served by CDN or web server
- Backend: Node.js server with PM2 or Docker
- Database: MySQL server or cloud database service
- Architecture: Load balancer → Frontend + Backend → Database

## Technology Transformation Summary

### What Changed
- **Architecture**: Monolithic → 3-tier separated architecture
- **Language**: TypeScript → Vanilla JavaScript throughout
- **Database**: PostgreSQL + Drizzle ORM → MySQL + Raw SQL
- **Frontend Build**: Vite SSR → Create React App SPA
- **UI Libraries**: shadcn/ui + Tailwind → Custom CSS + Minimal dependencies
- **Backend Structure**: Single file → MVC with controllers and routes

### Why These Changes
- **Separation of Concerns**: Clear boundaries between presentation, logic, and data
- **Technology Simplicity**: Reduced complexity with vanilla JavaScript and raw SQL
- **Performance**: Raw SQL queries for optimal database performance
- **Maintainability**: Standard React patterns and Express MVC structure
- **Flexibility**: Independent scaling and deployment of each tier

## Changelog
- June 26, 2025: **Major Architecture Transformation**
  - Implemented complete 3-tier architecture with separated frontend/backend
  - Converted entire codebase from TypeScript to JavaScript
  - Migrated from PostgreSQL+Drizzle to MySQL+Raw SQL
  - Replaced UI libraries with custom CSS design system
  - Restructured backend into MVC pattern with controllers and routes
  - Added comprehensive API documentation and development guides
- June 26, 2025: Added Mac compatibility features
- June 25, 2025: Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.