const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true,
  },
  stock: {
    type: Number,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    trim: true,
  },
  created: {
    type: Date,
    default: Date.now(),
  },
});

ProductSchema.index({ productName: "text" });

module.exports = mongoose.model("Product", ProductSchema);
