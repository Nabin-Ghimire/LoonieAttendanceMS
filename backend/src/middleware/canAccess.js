import createHttpError from 'http-errors';

export const canAccess = ([roles]) => {
  return (req, res, next) => {
    const rolesFromToken = req.auth.role;

    if (!roles.includes(rolesFromToken)) {
      const error = createHttpError(
        403,
        "You don't have enough permission",
      );
      next(error);
      return;
    }
    next();
  };
};
