// models/Quotation.js
import mongoose from 'mongoose';

const QuotationItemSchema = new mongoose.Schema({
  itemName:           { type: String, required: true },
  priceRange100to200: { type: Number },
  priceRange200to300: { type: Number },
  priceRange300plus:  { type: Number }
});

const QuotationSchema = new mongoose.Schema({
  client:             { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  quotationDate:      { type: Date, required: true },
  subject:            { type: String },
  reference:          { type: String },
  items:              [QuotationItemSchema],

  // Terms & Conditions
  includesTax:        { type: Boolean, default: false },
  includesPrinting:   { type: Boolean, default: false },
  includesDelivery:   { type: Boolean, default: false },
  deliveryTimeDays:   { type: String },
  paymentTerms:       { type: String },

  sellerName:         { type: String },
  sellerGSTIN:        { type: String },
  contactName:        { type: String },
  date:               { type: Date, default: Date.now },

  createdBy:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Quotation', QuotationSchema);
