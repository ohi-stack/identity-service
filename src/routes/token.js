import { Router } from 'express';

const router = Router();

/**
 * Token issuance and validation routes
 */
router.post('/issue', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

router.post('/verify', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

export default router;
