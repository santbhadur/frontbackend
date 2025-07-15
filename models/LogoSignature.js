const mongoose = require('mongoose');

const logoSignatureSchema = new mongoose.Schema({
  logoPath: {
    type: String,
    required: true
  },
  signaturePath: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LogoSignature', logoSignatureSchema);
