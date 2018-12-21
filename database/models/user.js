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
    type: String
  },
  password: {
    type: String
  }
});

module.exports = User;
