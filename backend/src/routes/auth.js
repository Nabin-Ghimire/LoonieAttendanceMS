import { Router } from "express";
const router = Router();
import AuthController from '../controllers/AuthController.js';
import UserService from '../services/UserService.js';
import TokenService from '../services/TokenService.js';
import logger from "../Config/logger.js";
import RefreshTokenModel from "../models/refreshTokenModel.js";
import UserModel from "../models/uerModel.js";
import CredentialService from "../services/CredentialService.js";
import registerValidator from "../validators/register-validator.js";
import loginValidator from "../validators/login-validator.js";
import authenticate from "../middleware/authenticate.js";
import parseRefreshToken from "../middleware/parseRefreshToken.js";

const userService = new UserService(UserModel);
const tokenService = new TokenService(RefreshTokenModel);
const credentialService = new CredentialService();
const authController = new AuthController(userService, tokenService, logger, credentialService);

//Define auth-related routes here

router.post('/register', registerValidator, (req, res, next) => authController.registerUser(req, res, next));
router.post('/login', loginValidator, (req, res, next) => authController.loginUser(req, res, next));
router.get('/self', authenticate, (req, res, next) => authController.getSelf(req, res, next));
router.post('/refresh-token', authenticate, parseRefreshToken, (req, res, next) => authController.refreshToken(req, res, next));
router.post('/logout', authenticate, parseRefreshToken, (req, res, next) => authController.logOutUser(req, res, next));


export default router;