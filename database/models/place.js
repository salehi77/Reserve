const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const Place = mongoose.model("Place", {
  ID: {
    type: Number
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
  equipment: {
    projector: {
      type: Boolean
    },
    computer: {
      type: Boolean
    },
    board: {
      type: Boolean
    },
    wifi: {
      type: Boolean
    }
  }
});

module.exports = Place;
