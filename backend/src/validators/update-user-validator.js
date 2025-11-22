import { checkSchema } from 'express-validator';

// Allow partial updates: validate fields only when present in the request body.
export default checkSchema({
  firstName: {
    optional: true,
    trim: true,
  },
  lastName: {
    optional: true,
    trim: true,
  },
  role: {
    optional: true,
    trim: true,
  },

  organizationId: {
    optional: true,
    trim: true,
    custom: {
      options: (value, { req }) => {
        // If role is not being updated, don't enforce organizationId here.
        const role = req.auth.role;
        if (!role) return true;
        // Admin and manager may have no organizationId
        if (role === 'admin' || role === 'manager') return true;
        // For other roles, require a non-empty organizationId
        return !!value;
      },
      errorMessage: 'Organization ID is required for non-admin/manager users',
    },
  },
});
