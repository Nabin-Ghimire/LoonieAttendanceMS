import { Router } from "express";
const router = Router();
import UserController from "../controllers/UserController.js"
import UserService from "../services/UserService.js"
import TokenService from '../services/TokenService.js';
import logger from "../Config/logger.js";
import RefreshTokenModel from "../models/refreshTokenModel.js";
import UserModel from "../models/uerModel.js";
import CredentialService from "../services/CredentialService.js";
import registerValidator from "../validators/register-validator.js";
import { canAccess } from "../middleware/canAccess.js";
import { Roles } from "../constants/index.js";
import authenticate from "../middleware/authenticate.js";
import updateUserValidator from "../validators/update-user-validator.js";
import listUserValidator from "../validators/list-user-validator.js";
import createUserValidator from "../validators/create-user-validator.js";

const userService = new UserService(UserModel);
const tokenService = new TokenService(RefreshTokenModel);
const credentialService = new CredentialService();
const userController = new UserController(userService, tokenService, logger, credentialService);


//Define user-related routes here
router.post('/register-user', authenticate, canAccess([Roles.ADMIN]), registerValidator, (req, res, next) => userController.createUser(req, res, next));
router.post('/create-user', authenticate, canAccess([Roles.ADMIN]), createUserValidator, (req, res, next) => userController.createUser(req, res, next));

router.patch('/update-user/:id', authenticate, updateUserValidator, canAccess([Roles.ADMIN]), (req, res, next) => userController.updateUser(req, res, next));

router.delete('/delete-user/:id', authenticate, canAccess([Roles.ADMIN]), (req, res, next) => userController.deleteUser(req, res, next));

router.get('/:id', authenticate, canAccess([Roles.ADMIN]), (req, res, next) => userController.getUserById(req, res, next));

router.get('/', authenticate, canAccess([Roles.ADMIN, Roles.MANAGER]), listUserValidator, (req, res, next) => userController.getAllUsers(req, res, next));


export default router;

