// models/Invoice.js
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  itemName: String,
  price: Number,
  quantity: Number,
  unit: String,
  gst: Number,
  amount: Number
});

const InvoiceSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  customerMobile: {
    type: String,
    required: true
  },
  billingNumber: {
    type: Number,
    required: true
  },
  billingDate: {
    type: Date,
    required: true
  },
  items: [ItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);
