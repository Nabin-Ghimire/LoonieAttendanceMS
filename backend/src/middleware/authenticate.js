import { expressjwt } from 'express-jwt';
import { Config } from '../Config/index.js';

export default expressjwt({
  secret: Config.PRIVATE_KEY,
  algorithms: ['HS256'],
  getToken(req) {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.split(' ')[1] !== 'undefined') {
      const token = authHeader.split(' ')[1];
      if (token) {
        return token;
      }
    }

    const { accessToken } = req.cookies;
    return accessToken;
  },
});
