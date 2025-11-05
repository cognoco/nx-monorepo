import express, { type Express } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { apiRouter } from './routes/index.js';
import { getOpenApiSpec } from './openapi/index.js';

/**
 * Create Express App
 *
 * Exported for testing purposes. Tests can instantiate the app
 * without starting the HTTP server or binding to ports.
 *
 * @returns Configured Express application
 */
export function createApp(): Express {
  const app = express();

  // Middleware
  app.use(express.json());

  // CORS configuration
  // Support multiple origins (comma-separated) for development scenarios
  // where multiple web apps run on different ports (3000, 3001, etc.)
  const corsOrigin = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
    : process.env.NODE_ENV === 'production'
    ? ['https://your-domain.com'] // Configure for production
    : [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
      ];

  app.use(
    cors({
      origin: corsOrigin,
      credentials: true,
    })
  );

  // Root endpoint (keep for backwards compatibility)
  app.get('/', (_req, res) => {
    res.send({ message: 'Hello API' });
  });

  // OpenAPI Documentation
  const openApiSpec = getOpenApiSpec();

  app.get('/api/docs/openapi.json', (_req, res) => {
    res.json(openApiSpec);
  });

  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(openApiSpec, {
      explorer: true,
      customSiteTitle: 'NX Monorepo API Docs',
    })
  );

  // Mount API routes under /api prefix
  app.use('/api', apiRouter);

  return app;
}
