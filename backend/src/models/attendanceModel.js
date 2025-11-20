import mongoose from "mongoose";
import { Schema } from "mongoose";

const AttendanceSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  clockIn: {
    time: Date,
    location: {
      type: { type: String, default: "Point" },
      coordinates: [Number]
    },
  },

  clockOut: {
    time: Date,
    location: {
      type: { type: String, default: "Point" },
      coordinates: [Number]
    },
  },

  date: {
    type: String, // "2025-01-10"
    required: true,
    index: true
  }
});


AttendanceSchema.index({ "clockIn.location": "2dsphere" });
AttendanceSchema.index({ "clockOut.location": "2dsphere" });


const AttendanceModel = mongoose.model("Attendance", AttendanceSchema);
export default AttendanceModel;