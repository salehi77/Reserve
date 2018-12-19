const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

var AdminSchema = new mongoose.Schema({
  username: {
    type: String
  },
  password: {
    type: String
  }
});

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
