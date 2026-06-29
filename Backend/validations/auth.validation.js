const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    phone: z.string().min(10, 'Phone must be at least 10 digits').optional().or(z.literal('')),
  }).refine((data) => data.email || data.phone, {
    message: 'Either email or phone is required',
    path: ['email'],
  }),
});

const loginSchema = z.object({
  body: z.object({
    identifier: z.string().min(3, 'Email or Phone is required'),
    password: z.string().min(6, 'Password is required'),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};