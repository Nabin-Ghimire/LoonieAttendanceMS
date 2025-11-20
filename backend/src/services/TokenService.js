import createHttpError from "http-errors";
import Jwt from "jsonwebtoken";
import { Config } from "../Config/index.js";

export class TokenService {
  constructor(RefreshTokenModel) { this.RefreshTokenModel = RefreshTokenModel; }
  generateAccessToken = async (JwtPayload) => {
    let PRIVATE_KEY = Config.PRIVATE_KEY;
    if (!PRIVATE_KEY) {
      throw new Error(createHttpError(500, "Private key not found"));
    }
    const token = Jwt.sign(JwtPayload, PRIVATE_KEY, {
      expiresIn: '1h',
      issuer: 'LoonieAttendanceMS',
      algorithm: 'HS256',
    });
    return token;
  }

  generateRefreshToken = async (JwtPayload) => {
    const refreshToken = Jwt.sign(JwtPayload, Config.REFRESH_TOKEN_SECRET, {
      expiresIn: '7d',
      issuer: 'LoonieAttendanceMS',
      algorithm: 'HS256',
    });
    return refreshToken;
  }

  async persistRefreshToken(user) {
    const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 7; //7 days

    const newRefreshToken = await this.RefreshTokenModel.create({
      user: user,
      expiresAt: new Date(Date.now() + MS_IN_YEAR),
    });
    return newRefreshToken;
  }

  async deleteRefreshTokenById(tokenId) {
    await this.RefreshTokenModel.deleteOne({ id: tokenId });
  }
}

export default TokenService;