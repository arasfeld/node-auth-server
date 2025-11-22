import { Router } from 'express';
import { ValidationError } from '../error';
import { authLimiter, getPgPool } from '../middleware';
import { RegistrationService } from '../services';
import { registrationSchema } from '../validation';

export const registrationRouter = Router();

// Note: Registration doesn't require CSRF since users don't have a session yet
// CSRF is primarily for protecting authenticated actions
registrationRouter.post('/register', authLimiter, async (req, res, next) => {
  // Validate input with zod
  const validationResult = registrationSchema.safeParse(req.body);

  if (!validationResult.success) {
    // Collect all validation errors for better UX
    const fieldErrors: Record<string, string[]> = {};
    validationResult.error.issues.forEach((issue) => {
      const path = issue.path.join('.');
      if (!fieldErrors[path]) {
        fieldErrors[path] = [];
      }
      fieldErrors[path].push(issue.message);
    });

    const firstError = validationResult.error.issues[0];
    return next(
      new ValidationError(firstError?.message || 'Invalid input', {
        fields: fieldErrors,
        field: firstError?.path[0] as string,
      }),
    );
  }

  const { username, password } = validationResult.data;

  const pgPool = getPgPool(req.app);
  const service = new RegistrationService(pgPool);
  const user = await service.register(username, password);

  res.status(201).json(user);
});
