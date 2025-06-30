import express from 'express';
import cors from 'cors';
import session from 'express-session';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { testConnection, initializeTables } from './config/database.js';

// Import route modules
import userRoutes from './routes/user.routes.js';
import templateRoutes from './routes/template.routes.js';
import contactRoutes from './routes/contact.routes.js';
import facebookRoutes from './routes/facebook.routes.js';
import tenantRoutes from './routes/tenants.routes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

/**
 * Security middleware configuration
 */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  }
}));

/**
 * Rate limiting configuration
 * Prevents abuse of API endpoints
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

app.use('/api/', limiter);

/**
 * CORS configuration
 * Allow frontend to communicate with backend
 */
app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

/**
 * Body parsing middleware
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Session configuration
 * Handles user authentication sessions
 */
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

/**
 * Request logging middleware
 * Logs all API requests for debugging
 */
app.use('/api', (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

/**
 * API Routes
 * Mount all route modules under /api prefix
 */
app.use('/api/users', userRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/facebook', facebookRoutes);
app.use('/api/tenants', tenantRoutes);

/**
 * Health check endpoint
 * Used for monitoring server status
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * Root endpoint
 * Provides basic API information
 */
app.get('/api', (req, res) => {
  res.json({
    message: 'WhatsApp Campaign Manager API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      templates: '/api/templates',
      contacts: '/api/contacts',
      tenants: '/api/tenants',
      health: '/api/health'
    }
  });
});

/**
 * 404 handler for API routes
 */
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    message: `The endpoint ${req.path} does not exist`
  });
});

/**
 * Global error handler
 * Catches and handles all unhandled errors
 */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  // Don't expose error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: isDevelopment ? err.message : 'Something went wrong',
    ...(isDevelopment && { stack: err.stack })
  });
});

/**
 * Initialize database and start server
 */
async function startServer() {
  try {
    // Test database connection
    console.log('Testing database connection...');
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('Failed to connect to database. Please check your database configuration.');
      process.exit(1);
    }
    
    // Initialize database tables
    console.log('Initializing database tables...');
    await initializeTables();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`
🚀 WhatsApp Campaign Manager API Server Started
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🔗 Health Check: http://localhost:${PORT}/api/health
📊 API Documentation: http://localhost:${PORT}/api
      `);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

/**
 * Graceful shutdown handling
 */
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();