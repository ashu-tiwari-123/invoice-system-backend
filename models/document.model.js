// models/Document.js
import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  hsn: { type: String },
  quantity: { type: Number, required: true },
  unit: { type: String },
  rate: { type: Number, required: true },
  discountPercent: { type: Number, default: 0 },
  amount: { type: Number, required: true },
});

const DocumentSchema = new mongoose.Schema(
  {
    documentType: {
      type: String,
      enum: [
        "invoice",
        "quotation",
        "proforma",
        "delivery_challan",
        "office_copy",
      ],
      required: true,
    },

    // Invoice/General fields
    invoiceNumber: { type: String, unique: true, sparse: true }, // unique to invoices
    invoiceDate: { type: Date },
    purchaseOrderNumber: { type: String },
    placeOfDelivery: { type: String },

    // Buyer Details
    buyerName: { type: String },
    buyerAddress: { type: String },
    buyerState: { type: String },
    buyerPinCode: { type: String },
    buyerCountry: { type: String },
    buyerPAN: { type: String },
    buyerGSTIN: { type: String },

    // Consignee Details
    consigneeName: { type: String },
    consigneeAddress: { type: String },
    consigneeState: { type: String },
    consigneePinCode: { type: String },
    consigneeCountry: { type: String },
    consigneePAN: { type: String },
    consigneeGSTIN: { type: String },

    // Items
    items: [ItemSchema],

    // Tax and Totals
    taxableValue: { type: Number },
    cgstRate: { type: Number },
    cgstAmount: { type: Number },
    sgstRate: { type: Number },
    sgstAmount: { type: Number },
    igstRate: { type: Number },
    igstAmount: { type: Number },
    totalTax: { type: Number },

    subtotal: { type: Number },
    roundOff: { type: Number },
    totalAmount: { type: Number },
    amountInWords: { type: String },

    // Seller Info
    sellerName: { type: String },
    sellerAddress: { type: String },
    sellerEmail: { type: String },
    sellerPhone: { type: String },

    // Bank Details
    bankName: { type: String },
    branch: { type: String },
    accountNumber: { type: String },
    ifsc: { type: String },

    // Link to Client
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    // Quotation-specific fields (optional in generic doc)
    subject: { type: String },
    reference: { type: String },
    includesTax: { type: Boolean },
    includesPrinting: { type: Boolean },
    includesDelivery: { type: Boolean },
    deliveryTimeDays: { type: String },
    paymentTerms: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Document", DocumentSchema);
