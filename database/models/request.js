const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const Request = mongoose.model("Request", {
  ID: {
    type: Number,
    require: true,
    unique: true
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
