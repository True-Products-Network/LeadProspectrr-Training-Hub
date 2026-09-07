import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { errorHandler } from './middleware/errorHandler';
import { requestContext } from './middleware/requestContext';
import { authRouter } from './routes/auth';
import { workspacesRouter } from './routes/workspaces';
import { linksRouter } from './routes/links';
import { domainsRouter } from './routes/domains';
import { analyticsRouter } from './routes/analytics';
import { campaignsRouter } from './routes/campaigns';
import { foldersRouter } from './routes/folders';
import { tagsRouter } from './routes/tags';
import { bioPagesRouter } from './routes/bio-pages';
import { adminRouter } from './routes/admin';

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
  origin: process.env.WEB_URL || 'http://localhost:5173',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Logging
app.use(morgan(process.env.LOG_FORMAT === 'json' ? 'combined' : 'dev'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request context
app.use(requestContext);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.1.0',
  });
});

// API routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/workspaces', workspacesRouter);
app.use('/api/v1/links', linksRouter);
app.use('/api/v1/domains', domainsRouter);
app.use('/api/v1/analytics', analyticsRouter);
app.use('/api/v1/campaigns', campaignsRouter);
app.use('/api/v1/folders', foldersRouter);
app.use('/api/v1/tags', tagsRouter);
app.use('/api/v1/bio-pages', bioPagesRouter);
app.use('/api/v1/admin', adminRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export { app };
