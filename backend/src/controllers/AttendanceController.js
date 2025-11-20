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

    const office = await this.officeService.findOffice();
    if (!office) return res.status(500).json({ message: "Office not configured" });

    const [officeLng, officeLat] = office.location.coordinates;
    const distance = calculateDistance(lng, lat, officeLat, officeLng);

    if (distance > office.radiusMeters) {
      return res.status(403).json({
        message: "You are outside the allowed attendance area",
        distance
      });
    }

    // CHECK TODAY'S ATTENDANCE
    const todayAttendance = await this.attendanceService.findTodayAttendance(userId);

    // --- MORNING (CLOCK IN) ---
    if (!todayAttendance) {
      const attendance = await this.attendanceService.clockIn(userId, lat, lng);

      return res.status(201).json({
        message: "Clock-in successful",
        attendance
      });
    }

    if (!(todayAttendance.toObject()).clockOut) {      // --- EVENING (CLOCK OUT) ---
      const updated = await this.attendanceService.clockOut(todayAttendance._id, lat, lng);

      return res.status(200).json({
        message: "Clock-out successful",
        attendance: updated
      });
    }

    // Already clocked out
    return res.status(400).json({
      message: "You already clocked out today"
    });
  }


}



export default AttendanceController;