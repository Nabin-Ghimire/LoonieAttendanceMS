import express from 'express';
const router = express.Router();
import logger from '../Config/logger.js';
import OfficeModel from '../models/officeModel.js';
import OfficeService from '../services/OfficeService.js'
import OfficeController from '../controllers/OfficeController.js'
import authenticate from '../middleware/authenticate.js';
import { canAccess } from '../middleware/canAccess.js';
import { Roles } from '../constants/index.js';


const officeService = new OfficeService(OfficeModel);
const officeController = new OfficeController(officeService, logger);

router.post('/create', authenticate, canAccess([Roles.ADMIN]), (req, res, next) => officeController.punchOffice(req, res, next));
router.delete('/remove/:id', authenticate, canAccess([Roles.ADMIN]), (req, res, next) => officeController.removeOffice(req, res, next))
router.get('/', authenticate, canAccess([Roles.ADMIN]), (req, res, next) => officeController.getAll(req, res, next))


export default router;
