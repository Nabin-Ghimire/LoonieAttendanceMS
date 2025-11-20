import { checkSchema } from 'express-validator';

export default checkSchema({
  firstName: {
    errorMessage: 'First name is required!',
    notEmpty: true,
    trim: true,
  },
  lastName: {
    errorMessage: 'Last name is required!',
    notEmpty: true,
    trim: true,
  },
  role: {
    errorMessage: 'Role is required!',
    trim: true,
  },
  email: {
    isEmail: {
      errorMessage: 'Email is not valid!',
    },
    notEmpty: true,
    errorMessage: 'Email is required!',
    trim: true,
  },
  organizationId: {
    errorMessage: 'Organization ID is required!',
    trim: true,
    custom: {
      options: (value, { req }) => {
        const role = req.body.role;
        if (role === 'admin' && role === 'manager') {
          return true; // admin can have tenantId as null , return true means passing the validation
        } else {
          return !!value; // tenantId is required for non-admin users, return false if value is empty
        }
      },
    },
  },
});
