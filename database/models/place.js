const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const Place = mongoose.model("Place", {
  ID: {
    type: String
  },
  name: {
    type: String
  },
  type: {
    type: String
  },
  capacity: {
    type: Number
  },
  datashow: {
    type: String
  }
});

module.exports = Place;
