import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import public routes
import propertiesRoutes from './routes/properties.routes';
import enquiriesRoutes from './routes/enquiries.routes';
import settingsRoutes from './routes/settings.routes';

// Import admin routes
import adminAuthRoutes from './routes/admin/auth.routes';
import adminDashboardRoutes from './routes/admin/dashboard.routes';
import adminPropertiesRoutes from './routes/admin/properties.routes';
import adminEnquiriesRoutes from './routes/admin/enquiries.routes';
import adminSettingsRoutes from './routes/admin/settings.routes';

const app = express();

// Security and utility middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root Endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Astrra Estates API is online and operational',
    version: '1.0.0',
    health: '/api/health',
    endpoints: {
      properties: '/api/properties',
      settings: '/api/settings',
      health: '/api/health',
    },
  });
});

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Astrra Estates API',
    version: '1.0.0',
  });
});

// Register Public Routes
app.use('/api/properties', propertiesRoutes);
app.use('/api/enquiries', enquiriesRoutes);
app.use('/api/settings', settingsRoutes);

// Register Admin Routes
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/admin/properties', adminPropertiesRoutes);
app.use('/api/admin/enquiries', adminEnquiriesRoutes);
app.use('/api/admin/settings', adminSettingsRoutes);

// 404 handler for API routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`,
  });
});

// Safe global error handler (no stack trace leak in response)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'An internal server error occurred.',
  });
});

export default app;
