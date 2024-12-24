const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

let User = mongoose.model("User ", userSchema);
module.exports = User;