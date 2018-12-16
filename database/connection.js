const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

const mongodbURL =
  process.env.MONGOLAB_URI || "mongodb://localhost/reservation";

mongoose.connect(
  mongodbURL,
  { useNewUrlParser: true }
);
