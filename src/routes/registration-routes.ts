import { Router } from 'express';
import { AppError } from '../error';
import { authLimiter, getPgPool } from '../middleware';
import { RegistrationService } from '../services';
import { registrationSchema } from '../validation';

export const registrationRouter = Router();

registrationRouter.post('/register', authLimiter, async (req, res) => {
  // Validate input with zod
  const validationResult = registrationSchema.safeParse(req.body);

  if (!validationResult.success) {
    const firstError = validationResult.error.issues[0];
    return res
      .status(400)
      .json({ message: firstError?.message || 'Invalid input' });
  }

  const { username, password } = validationResult.data;

  try {
    const pgPool = getPgPool(req.app);
    const service = new RegistrationService(pgPool);
    const user = await service.register(username, password);

    return res.status(201).json(user);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: 'an unhandled error occurred' });
  }
});
