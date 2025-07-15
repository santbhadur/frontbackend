const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  businessName: String,
  shopAddress: String,
  pinCode: String,
  city: String,
  state: String,
  gstNumber: String
}, { timestamps: true });

module.exports = mongoose.model('Business', businessSchema);
