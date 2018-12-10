const path = require("path");
var express = require("express");
var router = express.Router();

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose.connect(
  "mongodb://localhost/reservation",
  { useNewUrlParser: true }
);
counter = 0;

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
    type: String
  },
  dateTime: {
    type: Object
  },
  followCode: {
    type: Number
  }
});

const ReservedTime = mongoose.model("ReservedTime", {
  placeID: {
    type: String
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
    case "3":
      Place.find({})
        .then(docs => {
          res.render("rsv_3", { docs });
        })
        .catch(err => {
          console.log(err);
          res.status(400).send(err);
        });

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
    case "3":
      Request.findOneAndUpdate(
        { ID: req.query.requestID },
        {
          $set: {
            personDetail: {
              firstname: req.body.firstname,
              lastname: req.body.lastname,
              employeeNumber: req.body.employeeNumber,
              telNumber: req.body.telNumber,
              mobNumber: req.body.mobNumber
            },
            planDetail: {
              subject: req.body.subject,
              level: req.body.level,
              sponserName: req.body.sponserName,
              sponserTel: req.body.sponserTel
            },
            summary: req.body.summary,
            guestDetail: {
              totGuest: req.body.totGuest,
              acGuest: req.body.acGuest,
              nacGuest: req.body.nacGuest
            }
          }
        },
        (err, doc) => {
          if (err) return console.error(err);
          if (req.body.academic == "academic" || true) {
            res.redirect("/rsv?step=3&requestID=" + req.query.requestID);
          }
        }
      );
      break;
  }
});

router.post("/getReservedTimes", (req, res) => {
  // console.log(req.body);
  var dateToReserve = {
    year: req.body["dateToReserve[year]"],
    month: req.body["dateToReserve[month]"],
    date: req.body["dateToReserve[date]"]
  };
  ReservedTime.find({ placeID: req.body.placeID, date: dateToReserve })
    .select("time -_id")
    .then(docs => {
      var newdocs = [];
      for (var i = 0; i < docs.length; ++i) {
        newdocs.push(docs[i].time);
      }
      res.send(newdocs);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send(err);
    });
});

module.exports = router;
