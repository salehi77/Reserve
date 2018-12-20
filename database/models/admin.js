const mongoose = require("mongoose");

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
