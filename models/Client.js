const mongoose = require("mongoose");

const ClientsSchema = mongoose.Schema({
  name: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true, trim: true },
  institutionName: { type: String, required: true, trim: true },
  institutionType: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
  jobPosition: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  created: { type: Date, default: Date.now() },
  status: { type: String, required: true, trim: true },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = mongoose.model("Client", ClientsSchema);
