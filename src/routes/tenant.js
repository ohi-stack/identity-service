import { Router } from 'express';

const router = Router();

/**
 * Tenant management routes
 * Tenants represent isolated identity domains
 */
router.post('/register', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

router.get('/:tenantId', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

export default router;
