import { expressjwt } from 'express-jwt';
import { Config } from '../Config/index.js';

export default expressjwt({
  secret: Config.REFRESH_TOKEN_SECRET,
  algorithms: ['HS256'],
  getToken(req) {
    const { refreshToken } = req.cookies;
    return refreshToken;
  }
})