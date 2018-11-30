const path = require("path");
var express = require("express");
var router = express.Router();

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost/reservation");
counter = 0;

const Place = mongoose.model("Place", {
  name: {
    type: String
  },
  type: {
    type: String
  },
  capacity: {
    type: Number
  }
});

const Request = mongoose.model("Request", {
  ID: {
    type: Number
  },
  request_date: {
    type: Date,
    default: Date.now
  },
  academic: {
    type: String
  }
});

router.get("/", function(req, res, next) {
  res.sendFile(path.join(__dirname, "../public/home.html"));
});

router.get("/place_list", (req, res) => {
  Place.find({}).then(
    docs => {
      res.render("place-list", { docs });
    },
    err => {
      console.log("error");
      res.status(400).send("error");
    }
  );
});

router.get("/login", (req, res) => {
  res.send("you are login");
});

router.get("/rsv", (req, res) => {
  switch (req.query.step) {
    case "1":
      res.render("rsv_1");
      break;
    case "2":
      res.render("rsv_2_aca", { requestID: req.query.requestID });
      break;
  }
});

router.get("/submit-request", (req, res) => {
  counter++;
  var request = new Request({ ID: counter });
  request.save(function(err, doc) {
    if (err) return console.error(err);
    res.send({ requestID: doc.ID });
  });
});

router.post("/rsv", (req, res) => {
  // console.log(req.body);
  // console.log(req.query);
  switch (req.query.step) {
    case "2":
      Request.findOneAndUpdate(
        { ID: req.query.requestID },
        {
          $set: {
            academic: req.body.academic
          }
        },
        (err, doc) => {
          if (err) return console.error(err);
          if (req.body.academic == "academic" || true) {
            res.redirect("/rsv?step=2&requestID=" + req.query.requestID);
          }
        }
      );
      break;
  }
});

module.exports = router;
