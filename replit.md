# WhatsApp Business Campaign Manager

## Overview

This is a full-stack WhatsApp Business campaign management application built with React, Express.js, and PostgreSQL. The system allows businesses to connect their WhatsApp Business accounts, create message templates, manage contacts, and run automated marketing campaigns through the WhatsApp Business API.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL-based sessions with connect-pg-simple
- **API Design**: RESTful API with structured error handling

### Database Design
The application uses PostgreSQL with the following core tables:
- **users**: Business account information and WhatsApp credentials
- **campaigns**: Marketing campaign management and tracking
- **templates**: WhatsApp message templates with approval status
- **contacts**: Customer contact management with segmentation
- **messages**: Message delivery tracking and status
- **webhook_events**: WhatsApp webhook event logging

## Key Components

### WhatsApp Integration
- **Facebook Business API**: Embedded signup flow for WhatsApp Business accounts
- **Template Management**: Create and submit templates for WhatsApp approval
- **Message Delivery**: Send template-based messages through WhatsApp Business API
- **Webhook Handling**: Process delivery receipts and message status updates

### Campaign Management
- **Template-based Campaigns**: Link campaigns to approved WhatsApp templates
- **Contact Targeting**: Select specific contact segments for campaigns
- **Scheduling**: Support for immediate and scheduled campaign execution
- **Analytics**: Track delivery rates, response rates, and engagement metrics

### Contact Management
- **Import/Export**: Bulk contact operations with CSV support
- **Segmentation**: Tag-based contact organization
- **Validation**: Phone number and email validation
- **Activity Tracking**: Message history and engagement tracking

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

### Build Configuration
```bash
# Development
npm run dev

# Production Build
npm run build  # Builds both frontend and backend
npm run start  # Runs production server
```

## Changelog
- June 25, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.