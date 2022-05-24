const mongoose = require("mongoose");

const MaterialSchema = mongoose.Schema({
  type: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  typeOfHolding: {
    type: String,
    required: true,
    trim: true,
  },
  existingCode: {
    type: Number,
    required: true,
    trim: true,
  },
  loans: {
    type: Boolean,
    required: true,
  },
  conditions: {
    type: String,
    required: true,
    trim: true,
  },
  technicalCharacteristics: {
    type: String,
    required: true,
    trim: true,
  },
  paymentStatus: {
    type: String,
    required: true,
    trim: true,
  },
  publicationDate: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Material", MaterialSchema);
