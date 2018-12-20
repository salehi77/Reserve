const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const ReservedTime = mongoose.model("ReservedTime", {
  placeID: {
    type: Number
  },
  requestID: {
    type: Number
  },
  date: {
    type: Object
  },
  time: {
    type: Object
  }
});

module.exports = ReservedTime;
