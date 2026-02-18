import { Router } from 'express';

const router = Router();

/**
 * Authentication routes
 * Logic intentionally deferred
 */
router.post('/login', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

router.post('/logout', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

export default router;
