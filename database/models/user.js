const mongoose = require("mongoose");

// var UserSchema = new mongoose.Schema({
//   username: {
//     type: String
//   },
//   password: {
//     type: String
//   }
// });

// const User = mongoose.model("User", UserSchema);

const User = mongoose.model("User", {
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

module.exports = User;
