import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    trim: true,
    type: String,
    required: true,
  },
  lastName: {
    trim: true,
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'employee'],
    default: 'employee',
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
},);

const UserModel = mongoose.model('User', userSchema);
export default UserModel;