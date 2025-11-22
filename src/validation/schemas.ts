import { z } from 'zod';

// Username validation: 2-24 chars, starts with letter, alphanumeric + underscore
export const usernameSchema = z
  .string()
  .min(2, 'Username must be at least 2 characters')
  .max(24, 'Username must be at most 24 characters')
  .regex(
    /^[a-zA-Z]([_]?[a-zA-Z0-9])+$/,
    'Username must start with a letter and can only contain letters, numbers, and underscores',
  );

// Password validation: minimum 8 characters, at least one letter and one number
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(
    /^(?=.*[a-zA-Z])(?=.*\d)/,
    'Password must contain at least one letter and one number',
  );

// Registration schema
export const registrationSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

// Login schema (less strict, just check they're strings)
export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});
