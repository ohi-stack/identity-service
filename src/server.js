import { tenantContext } from './middleware/tenantContext.js';
import express from 'express';

import authRoutes from './routes/auth.js';
import tokenRoutes from './routes/token.js';
import tenantRoutes from './routes/tenant.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

/**
 * Global request boundary
 * (later: tracing, rate limits, audit)
 */
app.use((req, res, next) => {
  res.setHeader('X-OHI-Service', 'identity');
  next();
});

/**
 * Tenant resolution (mandatory for identity safety)
 */
app.use(tenantContext);

/**
 * Routes
 */
app.use('/auth', authRoutes);
app.use('/token', tokenRoutes);
app.use('/tenant', tenantRoutes);

/**
 * Health + liveness
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'identity-service',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Identity service running on port ${PORT}`);
});
