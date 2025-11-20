import mongoose from "mongoose";
const { Schema } = mongoose;

const OfficeSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],  // [lng, lat]
      required: true
    }
  },

  radiusMeters: { type: Number, default: 50 }
});

OfficeSchema.index({ location: "2dsphere" });

const OfficeModel = mongoose.model("Office", OfficeSchema);
export default OfficeModel;