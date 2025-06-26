# WhatsApp Campaign Manager - 3-Tier Architecture

## Architecture Overview

The application has been completely restructured into a clean 3-tier architecture with separated frontend and backend, following modern web development practices.

### Tier 1: Frontend (React Application)
- **Technology**: React 18 with vanilla JavaScript (converted from TypeScript)
- **Location**: `/frontend` directory
- **Port**: 3000 (default React development server)
- **Build Tool**: Create React App
- **Styling**: Pure CSS with custom design system
- **Icons**: Lucide React (minimal icon library)
- **Charts**: Chart.js for data visualization
- **Routing**: React Router DOM

### Tier 2: Backend (Express API Server)
- **Technology**: Express.js with vanilla JavaScript (converted from TypeScript)
- **Location**: `/backend` directory
- **Port**: 3001
- **Architecture Pattern**: MVC (Model-View-Controller)
- **Database**: MySQL with raw SQL queries
- **Authentication**: Session-based with express-session

### Tier 3: Database (MySQL)
- **Technology**: MySQL 8.0+
- **Connection**: mysql2 driver with connection pooling
- **Query Method**: Raw SQL queries (no ORM)
- **Tables**: Users, campaigns, templates, contacts, messages, webhook_events

## Project Structure

```
project-root/
├── frontend/                   # React frontend application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Header.js
│   │   │   ├── Sidebar.js
│   │   │   └── LoadingSpinner.js
│   │   ├── pages/              # Page components
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Campaigns.js
│   │   │   ├── Templates.js
│   │   │   ├── Contacts.js
│   │   │   ├── Analytics.js
│   │   │   └── Settings.js
│   │   ├── services/           # API communication
│   │   │   └── api.js
│   │   ├── styles/             # CSS stylesheets
│   │   │   └── index.css
│   │   ├── utils/              # Utility functions
│   │   ├── App.js              # Main app component
│   │   └── index.js            # Entry point
│   └── package.json
├── backend/                    # Express backend API
│   ├── controllers/            # Request handlers
│   │   ├── user.controller.js
│   │   ├── campaign.controller.js
│   │   ├── template.controller.js
│   │   └── contact.controller.js
│   ├── routes/                 # Route definitions
│   │   ├── user.routes.js
│   │   ├── campaign.routes.js
│   │   ├── template.routes.js
│   │   └── contact.routes.js
│   ├── config/                 # Configuration files
│   │   └── database.js
│   ├── middleware/             # Custom middleware
│   │   └── auth.js
│   ├── database/               # Database utilities
│   ├── server.js               # Main server file
│   ├── .env.example            # Environment variables template
│   └── package.json
└── README.md
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  whatsapp_business_id VARCHAR(100),
  access_token TEXT,
  phone_number VARCHAR(20),
  business_name VARCHAR(100),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Templates Table
```sql
CREATE TABLE templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  language VARCHAR(10) NOT NULL DEFAULT 'en',
  content TEXT NOT NULL,
  header_type VARCHAR(20),
  header_content TEXT,
  footer_text VARCHAR(60),
  buttons JSON,
  status VARCHAR(20) DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Contacts Table
```sql
CREATE TABLE contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  tags JSON,
  custom_fields JSON,
  opt_in_status BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Campaigns Table
```sql
CREATE TABLE campaigns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  template_id INT NOT NULL,
  target_contacts JSON,
  scheduled_at DATETIME,
  status VARCHAR(20) DEFAULT 'DRAFT',
  messages_sent INT DEFAULT 0,
  messages_delivered INT DEFAULT 0,
  messages_read INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE
);
```

### Messages Table
```sql
CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  campaign_id INT NOT NULL,
  contact_id INT NOT NULL,
  whatsapp_message_id VARCHAR(100),
  status VARCHAR(20) DEFAULT 'PENDING',
  sent_at TIMESTAMP NULL,
  delivered_at TIMESTAMP NULL,
  read_at TIMESTAMP NULL,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);
```

### Webhook Events Table
```sql
CREATE TABLE webhook_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  whatsapp_message_id VARCHAR(100) NOT NULL,
  payload JSON NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### User Management
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout
- `GET /api/users/me` - Get current user
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `PUT /api/users/:id/whatsapp` - Update WhatsApp config

### Campaign Management
- `GET /api/campaigns` - Get user campaigns
- `GET /api/campaigns/:id` - Get single campaign
- `POST /api/campaigns` - Create campaign
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign
- `POST /api/campaigns/:id/start` - Start campaign
- `GET /api/campaigns/:id/stats` - Get campaign stats

### Template Management
- `GET /api/templates` - Get user templates
- `GET /api/templates/categories` - Get template categories
- `GET /api/templates/:id` - Get single template
- `POST /api/templates` - Create template
- `PUT /api/templates/:id` - Update template
- `DELETE /api/templates/:id` - Delete template
- `POST /api/templates/:id/submit` - Submit for approval
- `POST /api/templates/:id/preview` - Preview template

### Contact Management
- `GET /api/contacts` - Get user contacts
- `GET /api/contacts/stats` - Get contact statistics
- `GET /api/contacts/tags` - Get available tags
- `GET /api/contacts/:id` - Get single contact
- `POST /api/contacts` - Create contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact
- `POST /api/contacts/bulk-import` - Bulk import contacts

## Development Setup

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Backend Setup
1. Navigate to backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Copy environment file: `cp .env.example .env`
4. Configure database connection in `.env`
5. Start server: `npm run dev`

### Frontend Setup
1. Navigate to frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start development server: `npm start`

### Database Setup
1. Create MySQL database
2. Update connection details in `backend/.env`
3. Start backend server (tables will be created automatically)

## Key Features Implemented

### Security
- Password hashing with bcryptjs
- Session-based authentication
- CORS protection
- Rate limiting
- Helmet security headers
- Input validation

### Performance
- MySQL connection pooling
- Efficient database queries
- Frontend code splitting
- CSS optimization
- Image optimization

### User Experience
- Responsive design
- Loading states
- Error handling
- Form validation
- Real-time updates

### WhatsApp Integration
- Business API integration
- Template management
- Message sending
- Webhook handling
- Campaign analytics

## Technology Choices Rationale

### Frontend (React + Vanilla CSS)
- **React**: Industry standard, component-based architecture
- **Vanilla CSS**: Full control, no dependency bloat, custom design system
- **Chart.js**: Lightweight, performant charting library
- **Lucide React**: Minimal icon library, tree-shakeable

### Backend (Express + Raw SQL)
- **Express.js**: Minimal, flexible, widely adopted
- **Raw SQL**: Maximum performance, full control, no ORM overhead
- **MySQL**: Reliable, mature, excellent performance
- **Session-based auth**: Simple, secure, stateful

### Development Benefits
- Clear separation of concerns
- Independent scaling
- Technology flexibility
- Maintainable codebase
- Performance optimization
- Security best practices

## Deployment Architecture

### Development
- Frontend: `localhost:3000`
- Backend: `localhost:3001`
- Database: Local MySQL instance

### Production
- Frontend: Static files served by CDN
- Backend: Node.js server (PM2/Docker)
- Database: MySQL server or cloud database
- Load balancer for high availability

This architecture provides a solid foundation for a scalable WhatsApp campaign management platform with clear separation between presentation, business logic, and data layers.