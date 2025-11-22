class AttendanceService {
  constructor(attendanceModel) {
    this.attendanceModel = attendanceModel;
  }

  async clockIn(userId, lat, lng) {
    const today = new Date().toISOString().split("T")[0];

    return this.attendanceModel.create({
      userId,
      date: today,
      clockIn: {
        time: new Date(),
        location: {
          type: "Point",
          coordinates: [lat, lng]
        }
      },
      clockOut: null,
    });
  }

  async clockOut(userId, lat, lng) {
    return this.attendanceModel.findByIdAndUpdate(
      userId,
      {
        clockOut: {
          time: new Date(),
          location: {
            type: "Point",
            coordinates: [lat, lng]
          }
        }
      },
      { new: true }
    );
  }



  async findTodayAttendance(userId) {
    const today = new Date().toISOString().split("T")[0];
    return this.attendanceModel.findOne({ $and: [{ userId: userId }, { date: today }] });
  }

}

export default AttendanceService;