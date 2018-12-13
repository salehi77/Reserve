const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const mongodbURL =
  process.env.MONGOLAB_URI || "mongodb://localhost/reservation";

mongoose.connect(
  mongodbURL,
  { useNewUrlParser: true }
);
