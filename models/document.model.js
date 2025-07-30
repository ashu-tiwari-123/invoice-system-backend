// models/Document.js
import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  description:      { type: String, required: true },
  hsn:              { type: String },
  quantity:         { type: Number, required: true },
  unit:             { type: String },
  rate:             { type: Number, required: true },
  discountPercent:  { type: Number, default: 0 },
  amount:           { type: Number, required: true }
});

const DocumentSchema = new mongoose.Schema({
  documentType:  { 
    type: String, 
    enum: ['invoice', 'proforma', 'delivery_challan', 'office_copy'],
    required: true 
  },

  invoiceNumber:        { type: String, unique: true, sparse: true },
  invoiceDate:          { type: Date },
  purchaseOrderNumber:  { type: String },
  placeOfDelivery:      { type: String },

  // Buyer Details
  buyerName:            { type: String },
  buyerAddress:         { type: String },
  buyerState:           { type: String },
  buyerPinCode:         { type: String },
  buyerCountry:         { type: String },
  buyerPAN:             { type: String },
  buyerGSTIN:           { type: String },

  // Consignee Details
  consigneeName:        { type: String },
  consigneeAddress:     { type: String },
  consigneeState:       { type: String },
  consigneePinCode:     { type: String },
  consigneeCountry:     { type: String },
  consigneePAN:         { type: String },
  consigneeGSTIN:       { type: String },

  // Items
  items:                [ItemSchema],

  // Tax/Totals
  taxableValue:         { type: Number },
  cgstRate:             { type: Number },
  cgstAmount:           { type: Number },
  sgstRate:             { type: Number },
  sgstAmount:           { type: Number },
  igstRate:             { type: Number },
  igstAmount:           { type: Number },
  totalTax:             { type: Number },

  subtotal:             { type: Number },
  roundOff:             { type: Number },
  totalAmount:          { type: Number },
  amountInWords:        { type: String },

  sellerName:           { type: String },
  sellerAddress:        { type: String },
  sellerEmail:          { type: String },
  sellerPhone:          { type: String },

  bankName:             { type: String },
  branch:               { type: String },
  accountNumber:        { type: String },
  ifsc:                 { type: String },

  // Link to Client
  client:               { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },

  // Owner/creator (ready for multi-user)
  createdBy:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Document', DocumentSchema);
