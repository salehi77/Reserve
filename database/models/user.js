const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const User = mongoose.model("User", {
  username: {
    type: String
  },
  password: {
    type: String
  }
});

module.exports = User;
