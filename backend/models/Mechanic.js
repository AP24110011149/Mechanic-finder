const mongoose = require("mongoose");

const MechanicSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String },
  phone: String,
  specialization: String,
  specialties: [String],
  services: [String],
  contact: String,
  location: mongoose.Schema.Types.Mixed,
  availability: Boolean,
  rating: Number
});

module.exports = mongoose.model("Mechanic", MechanicSchema);
