import { checkSchema } from 'express-validator';

export default checkSchema({
  email: {
    isEmail: {
      errorMessage: 'Valid email required',
    },
    notEmpty: {
      errorMessage: 'Email is required',
    },
  },
  password: {
    notEmpty: {
      errorMessage: 'Password is required',
    },
    isLength: {
      options: { min: 6 },
      errorMessage: 'Password must be at least 6 characters',
    },
  },
});
