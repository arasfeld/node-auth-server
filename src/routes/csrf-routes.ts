import { Router } from 'express';
import { generateCsrfToken } from '../middleware';

export const csrfRouter = Router();

// Endpoint to get CSRF token (must be called with valid session)
// This will generate a token and set a cookie automatically
csrfRouter.get('/csrf-token', (req, res) => {
  const token = generateCsrfToken(req, res);
  res.json({ csrfToken: token });
});
