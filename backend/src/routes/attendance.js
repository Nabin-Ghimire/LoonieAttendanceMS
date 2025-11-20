import express from 'express';
const router = express.Router();
import attendanceModel from '../models/attendanceModel.js';
import AttendanceController from '../controllers/AttendanceController.js';
import AttendanceService from '../services/AttendanceService.js';
import logger from '../Config/logger.js';
import OfficeModel from '../models/officeModel.js';
import OfficeService from '../services/OfficeService.js'
import authenticate from '../middleware/authenticate.js';


const attendanceService = new AttendanceService(attendanceModel);
const officeService = new OfficeService(OfficeModel)
const attendanceController = new AttendanceController(attendanceService, officeService, logger);

router.post('/create', authenticate, (req, res, next) => attendanceController.punch(req, res, next));
router.get('/', authenticate, (req, res, next) => attendanceController.getAttendanceReport(req, res, next))


export default router;
