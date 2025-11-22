import bcrypt from "bcryptjs";
import { matchedData, validationResult } from "express-validator";
import createHttpError from "http-errors";
import generatePassword from '../utils/randomPasswordGenerator.js'
import sendEmployeeCreds from "../utils/email.js";

class UserController {
  constructor(userService, userModel, logger) {
    this.logger = logger;
    this.userService = userService;
    this.userModel = userModel;
  }

  async createUser(req, res, next) {

    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(createHttpError(400, result.array()[0].msg));
    }

    const { firstName, lastName, email, role, organizationId, status } = req.body;
    const payload = { firstName, lastName, email };
    if (role !== undefined) payload.role = role;
    if (organizationId) payload.organizationId = organizationId;
    if (status !== undefined) payload.status = status;

    // const hashedPassword = await bcrypt.hash(password, 10);
    // payload.password = hashedPassword;


    const randomPassword = generatePassword(8);
    console.log('Random Password', randomPassword)

    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    payload.password = hashedPassword

    try {

      const user = await this.userService.createUser(payload)

      const mailResult = await sendEmployeeCreds(firstName, lastName, email, randomPassword)
      console.log(mailResult)

      if (!mailResult.success) {
        return res.status(500).json({
          message: "Failed to send credentials!"
        })
      }

      res.status(201).json({ user });
      this.logger.info('User created', { id: String(user._id) });

    } catch (error) {
      console.error("Error in createUser controller:", error);
      next(error);
    }

  }

  async updateUser(req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(createHttpError(400, result.array()[0].msg));
    }

    const { firstName, lastName, organizationId, role } = req.body;
    const userId = req.params.id;

    const payload = {
      firstName, lastName, organizationId, role
    }


    try {
      await this.userService.updateUser(userId, payload);

      this.logger.info('User has been updated', { id: userId });

      res.status(200).json({ id: userId });
    } catch (err) {
      next(err);
    }
  }

  async deleteUser(req, res, next) {
    const userId = req.params.id;

    try {
      await this.userService.removeUser(userId);
      this.logger.info('User has been deleted', {
        id: Number(userId),
      });

      res.status(200).json({ id: userId, message: "User deleted" })
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    const userId = req.params.id;
    try {
      const user = await this.userService.findUserById(userId);
      if (!user) {
        return next(createHttpError(404, "User not found"));
      }
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req, res, next) {

    const validateQuery = matchedData(req, { onlyValidData: true })

    try {
      // req.query contains search, role, pagination params
      // req.auth contains authenticated user info: { sub: userId, role: authRole }
      const [users, total] = await this.userService.getAllUsers(validateQuery, req.auth);

      res.status(200).json({
        success: true,
        total,
        users
      });
      this.logger.info('Fetched all users');

    } catch (error) {
      console.error("Error in getAllUsers controller:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
}


export default UserController;