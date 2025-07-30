import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["owner", "admin", "user"], default: "owner" },

    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },

    resetToken: { type: String },
    resetTokenExpiry: { type: Date },

    passwordChangedAt: { type: Date },

    lastLogin: { type: Date },
  },
  { timestamps: true }
);

// Optional methods to help with lockout logic can be added here

export default mongoose.model("User", UserSchema);
