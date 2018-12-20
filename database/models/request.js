const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const Request = mongoose.model("Request", {
  ID: {
    type: Number
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  academic: {
    type: String
  },
  personDetail: {
    type: Object
  },
  planDetail: {
    type: Object
  },
  summary: {
    type: String
  },
  guestDetail: {
    type: Object
  },
  placeID: {
    type: Number
  },
  date: {
    type: Object
  },
  time: {
    type: Object
  },
  followCode: {
    type: Number
  }
});

module.exports = Request;
