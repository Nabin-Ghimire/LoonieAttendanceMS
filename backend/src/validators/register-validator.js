import { checkSchema } from 'express-validator';

export default checkSchema({
  firstName: {
    notEmpty: {
      errorMessage: 'Name is required',
    },
  },
  lastName: {
    notEmpty: {
      errorMessage: 'Name is required',
    },
  },
  email: {
    isEmail: {
      errorMessage: 'Valid email required',
    },
    notEmpty: {
      errorMessage: 'Email is required',
    },
  },
  password: {
    optional: true,
    isLength: {
      options: { min: 6 },
      errorMessage: 'Password must be at least 6 characters long'
    }
  }
});
