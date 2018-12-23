const mongoose = require("mongoose");

var AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true
  },
  password: {
    type: String,
    require: true,
    minlength: 3
  }
});

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
