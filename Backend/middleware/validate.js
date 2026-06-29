const { z } = require('zod');
const AppError = require('../utils/AppError');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Format Zod errors to a readable structure
      const formattedErrors = error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      
      const appError = new AppError('Validation Error', 400);
      appError.errors = formattedErrors;
      return next(appError);
    }
    next(new AppError('Internal validation error', 500));
  }
};

module.exports = validate;