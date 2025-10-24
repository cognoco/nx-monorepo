import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { apiRouter } from './routes';
import { getOpenApiSpec } from './openapi';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3001;

const app = express();

// Middleware
app.use(express.json());

// Root endpoint (keep for backwards compatibility)
app.get('/', (_req, res) => {
  res.send({ message: 'Hello API' });
});

// OpenAPI Documentation (mount before API router for specificity)
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

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
  console.log(`[ health ] http://${host}:${port}/api/health`);
  console.log(`[ docs ] http://${host}:${port}/api/docs`);
  console.log(`[ spec ] http://${host}:${port}/api/docs/openapi.json`);
});
