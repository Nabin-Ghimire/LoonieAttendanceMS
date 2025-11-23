import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import bcrypt from 'bcryptjs';

class AuthController {
  constructor(userService, tokenService, logger, credentialService) {
    this.userService = userService;
    this.tokenService = tokenService;
    this.logger = logger;
    this.credentialService = credentialService;
  }

  async registerUser(req, res, next) {

    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(createHttpError(400, result.array()[0].msg));
    }

    const { firstName, lastName, email, password, role, organizationId, status } = req.body;
    const payload = { firstName, lastName, email, password };
    if (role !== undefined) payload.role = role;
    if (organizationId !== undefined) payload.organizationId = organizationId;
    if (status !== undefined) payload.status = status;

    const hashedPassword = await bcrypt.hash(password, 10);
    payload.password = hashedPassword;

    try {
      const user = await this.userService.createUser(payload);
      const jwtPayload = {
        sub: String(user._id),
        role: user.role,
      }
      const accessToken = await this.tokenService.generateAccessToken(jwtPayload);
      const newRefreshTokenDb = await this.tokenService.persistRefreshToken(user._id);
      const refreshToken = await this.tokenService.generateRefreshToken({ ...jwtPayload, id: String(newRefreshTokenDb._id) });

      // Set access and Refresh tokens in HTTP-only cookies
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'strict',
        domain: 'localhost',
        maxAge: 60 * 60 * 1000,
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        domain: 'localhost',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }

      )
      res.status(201).json({ user });

    } catch (error) {
      console.error("Error in createUser controller:", error);
      next(error);
    }

  }

  async loginUser(req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(createHttpError(400, result.array()[0].msg));
    }

    const { email, password } = req.body;

    try {
      const findUser = await this.userService.findUserByEmail(email);
      if (!findUser) {
        return next(createHttpError(404, "User not found"));
      }
      const isPasswordValid = await this.credentialService.matchPassword(password, findUser.password);

      if (!isPasswordValid) {
        return next(createHttpError(401, "Email or Password doesn't match"));
      }

      const jwtPayload = {
        sub: String(findUser._id),
        role: findUser.role,
        organizationId: findUser.organizationId ? String(findUser.organizationId) : '',
      }

      const accessToken = await this.tokenService.generateAccessToken(jwtPayload);
      const newRefreshTokenDb = await this.tokenService.persistRefreshToken(findUser._id);
      const refreshToken = await this.tokenService.generateRefreshToken({ ...jwtPayload, id: String(newRefreshTokenDb._id) });

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 60 * 60 * 1000,
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ user: findUser });
      this.logger.info('User logged in', { id: String(findUser._id) });

    } catch (error) {
      next(error);
    }
  }

  async getSelf(req, res, next) {
    const userId = req.auth.sub;
    try {
      const user = await this.userService.findUserById(userId);
      if (!user) {
        return next(createHttpError(404, "User not found"));
      }
      res.status(200).json({ user });
      this.logger.info('Fetched self user data', { id: String(userId) });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    const jwtPayload = {
      sub: req.auth.sub,
      role: req.auth.role,
      organizationId: req.auth.organizationId ? String(req.auth.organizationId) : ''
    }

    try {
      const accessToken = await this.tokenService.generateAccessToken(jwtPayload);
      const user = await this.userService.findUserById(req.auth.sub);
      if (!user) {
        throw (createHttpError(500, "User not found"))
      }
      const newRefreshToken = await this.tokenService.persistRefreshToken(user);
      await this.tokenService.deleteRefreshTokenById(req.auth.id)
      const refreshToken = await this.tokenService.generateRefreshToken({ ...jwtPayload, id: String(newRefreshToken._id) })
      res.cookie('accessToken', accessToken, {
        domain: 'localhost',
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 //1 hour 
      })

      res.cookie('refreshToken', refreshToken, {
        domain: 'localhost',
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 7 //7 days
      })

      res.status(200).json({ id: user._id })
      this.logger.info('Token refreshed', { id: String(user._id) });
    } catch (error) {
      next(error)
    }



  }

  async logOutUser(req, res, next) {

    console.log("Logout request received", req.auth);
    const refreshTokenId = req.auth.id;
    try {
      await this.tokenService.deleteRefreshTokenById(refreshTokenId);
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.status(200).json({ message: "Logged out successfully" });
      this.logger.info('User logged out', { id: String(req.auth.sub) });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
