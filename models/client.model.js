// models/Client.js
import mongoose from 'mongoose';

const ClientSchema = new mongoose.Schema({
  clientName:    { type: String, required: true },
  companyName:   { type: String },
  address:       { type: String, required: true },
  email:         { type: String },
  mobileNumber:  { type: String },
  gstNumber:     { type: String },
  notes:         { type: String }
}, { timestamps: true });

export default mongoose.model('Client', ClientSchema);
