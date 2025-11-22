import AttendanceModel from "../models/attendanceModel.js";
import UserModel from "../models/uerModel.js";
import calculateDistance from "../utils/calculateDistance.js";

class AttendanceController {
  constructor(attendanceService, officeService, logger) {
    this.attendanceService = attendanceService;
    this.logger = logger;
    this.officeService = officeService;
  }


  async punch(req, res, next) {
    const { lat, lng } = req.body;
    const userId = req.auth.sub;


    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    console.log('Punch request received:', { userId, lat, lng });
    const office = await this.officeService.findOffice();
    if (!office) return res.status(500).json({ message: "Office not configured" });

    const [officeLng, officeLat] = office.location.coordinates;
    const distance = calculateDistance(lngNum, latNum, officeLat, officeLng);

    if (distance > office.radiusMeters) {
      return res.status(403).json({
        message: "You are outside the allowed attendance area",
        distance
      });
    }

    // CHECK TODAY'S ATTENDANCE
    const todayAttendance = await this.attendanceService.findTodayAttendance(userId);
    console.log('Today Attendance:', todayAttendance);

    // --- MORNING (CLOCK IN) ---
    if (!todayAttendance) {
      const attendance = await this.attendanceService.clockIn(userId, lat, lng);

      return res.status(201).json({
        message: "Clock-in successful",
        attendance
      });
      this.logger.info('User clocked in', { id: String(attendance._id) });
    }

    if (!(todayAttendance.toObject()).clockOut) {      // --- EVENING (CLOCK OUT) ---
      const updated = await this.attendanceService.clockOut(todayAttendance._id, lat, lng);

      return res.status(200).json({
        message: "Clock-out successful",
        attendance: updated
      });
      this.logger.info('User clocked out', { id: String(updated._id) });
    }

    // Already clocked out
    return res.status(400).json({
      message: "You already clocked out today"
    });
  }


  async getAttendanceReport(req, res, next) {
    try {
      const { startDate, endDate, search } = req.query;
      const role = req.auth.role;
      const userId = req.auth.sub;


      let employeeIds;

      if (role === "admin") {
        const users = await UserModel.find().select("_id firstName lastName");
        employeeIds = users.map(u => u._id);
      } else if (role === "manager") {
        const users = await UserModel.find({ $or: [{ organizationId: userId }, { _id: userId }] }).select("_id firstName lastName");
        employeeIds = users.map(u => u._id);
      } else {

        employeeIds = [userId];
      }


      let dateFilter = {};
      if (startDate && endDate) {
        dateFilter.date = { $gte: startDate, $lte: endDate };
      }


      const attendances = await AttendanceModel.find({
        userId: { $in: employeeIds },
        ...dateFilter
      }).sort({ date: 1 }).populate("userId", "firstName lastName");


      const groupedReport = {};
      attendances.forEach(a => {
        const userId = a.userId._id.toString();
        const fullName = `${a.userId.firstName} ${a.userId.lastName}`;

        if (!groupedReport[userId]) {
          groupedReport[userId] = {
            userId,
            fullName,
            records: [],
            totalHours: 0
          };
        }


        let workHour = 0;
        if (a.clockIn?.time && a.clockOut?.time) {
          workHour = (new Date(a.clockOut.time) - new Date(a.clockIn.time)) / (1000 * 60 * 60); // hours
          groupedReport[userId].totalHours += workHour;
        }

        groupedReport[userId].records.push({
          date: a.date,
          clockIn: a.clockIn?.time || null,
          clockOut: a.clockOut?.time || null,
          workHour: workHour.toFixed(2)
        });
      });



      let reportArray = Object.values(groupedReport);


      if (search) {
        reportArray = reportArray.filter(r =>
          r.fullName.toLowerCase().includes(search.toLowerCase())
        );
      }

      reportArray.sort((a, b) => a.fullName.localeCompare(b.fullName));

      res.status(200).json({
        period: { startDate, endDate },
        report: reportArray
      });
      this.logger.info('Generated attendance report', { requestedBy: String(userId) });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };



}



export default AttendanceController;