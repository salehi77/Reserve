const path = require("path");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const Place = require("./../database/models/place");
const Request = require("./../database/models/request");
const User = require("./../database/models/user");

router.get("/submit-request", (req, res) => {
  Request.find({})
    .select("ID -_id")
    .sort("ID")
    .then(docs => {
      var requestID = docs.length == 0 ? 1 : docs[docs.length - 1].ID + 1;
      var request = new Request({ ID: requestID });
      request.save(function(err, doc) {
        if (err) return console.error(err);
        res.send({ error: null, requestID: doc.ID });
      });
    })
    .catch(err => {
      console.error(err);
      res.status(400).send({ error: err });
    });
});

router.get("/rsv", (req, res) => {
  switch (req.query.step) {
    case "1":
      res.render("rsv_1", { title: "رزرو- مرحله اول" });
      break;
    case "2":
      res.render("rsv_2_aca", {
        requestID: req.query.requestID,
        title: "رزرو- مرحله دوم"
      });
      break;
    case "3":
      Place.find({})
        .then(docs => {
          res.render("rsv_3", { docs, title: "رزرو- مرحله سوم" });
        })
        .catch(err => {
          console.error(err);
          res.status(400).send(err);
        });
      break;
    case "4":
      let followCode =
        req.query.followCode === undefined
          ? "خطایی رخ داده است!"
          : req.query.followCode;

      res.render("rsv_4", {
        requestID: req.query.requestID,
        followCode,
        title: "رزرو- مرحله چهارم"
      });
      break;
  }
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
            res.redirect(
              "/reserveProc/rsv?step=2&requestID=" + req.query.requestID
            );
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
              username: req.body.username,
              telNumber: req.body["tel-number"],
              mobNumber: req.body["mob-number"]
            },
            planDetail: {
              subject: req.body.subject,
              level: req.body.level,
              sponserName: req.body["sponser-name"],
              sponserTel: req.body["sponser-tel"]
            },
            summary: req.body.summary
          }
        },
        (err, doc) => {
          if (err) return console.error(err);
          if (req.body.academic == "academic" || true) {
            res.redirect(
              "/reserveProc/rsv?step=3&requestID=" + req.query.requestID
            );
          }
        }
      );
      break;
    case "4":
      async function f() {
        let request = await Request.findOne({ ID: req.query.requestID });

        if (request.personDetail === undefined) {
          res.redirect(
            "/reserveProc/rsv?step=4&requestID=" + req.query.requestID
          );
          return;
        }

        var followCode = Math.floor(Math.random() * 100000) + 10000;
        Request.findOneAndUpdate(
          { ID: req.query.requestID },
          {
            $set: {
              placeID: parseInt(req.body.placeID),
              followCode,
              date: {
                year: req.body.year,
                month: req.body.month,
                date: req.body.date
              },
              time: {
                hourFrom: req.body.hourFrom,
                minFrom: req.body.minFrom,
                hourTo: req.body.hourTo,
                minTo: req.body.minTo
              }
            }
          }
        )
          .then(doc => {
            res.redirect(
              "/reserveProc/rsv?step=4&requestID=" +
                req.query.requestID +
                "&followCode=" +
                followCode
            );
          })
          .catch(err => {
            console.error(err);
            res.send(400).send(err);
          });
      }
      f();
      break;
  }
});

router.post("/checkReservedTimes", (req, res) => {
  // console.log(req.body);
  var dateToReserve = {
    year: req.body["dateToReserve[year]"],
    month: req.body["dateToReserve[month]"],
    date: req.body["dateToReserve[date]"]
    // year: req.body.dateToReserve.year,
    // month: req.body.dateToReserve.month,
    // date: req.body.dateToReserve.date
  };
  Request.find({
    placeID: parseInt(req.body.placeID),
    date: dateToReserve
  })
    .select("time -_id")
    .then(docs => {
      var fromTime1 =
        parseInt(req.body["timeToReserve[hourFrom]"]) * 3600 +
        parseInt(req.body["timeToReserve[minFrom]"]) * 60;
      // parseInt(req.body.timeToReserve.hourFrom) * 3600 +
      // parseInt(req.body.timeToReserve.minFrom) * 60;
      var toTime1 =
        parseInt(req.body["timeToReserve[hourTo]"]) * 3600 +
        parseInt(req.body["timeToReserve[minTo]"]) * 60;
      // parseInt(req.body.timeToReserve.hourTo) * 3600 +
      // parseInt(req.body.timeToReserve.minTo) * 60;
      if (fromTime1 >= toTime1) {
        res.send({ error: null, reserved: false, wrongTime: true });
        return;
      }

      for (var i = 0; i < docs.length; ++i) {
        var fromTime2 =
          parseInt(docs[i].time.hourFrom) * 3600 +
          parseInt(docs[i].time.minFrom) * 60;
        var toTime2 =
          parseInt(docs[i].time.hourTo) * 3600 +
          parseInt(docs[i].time.minTo) * 60;

        if (
          (fromTime1 >= fromTime2 && fromTime1 < toTime2) ||
          (toTime1 <= toTime2 && toTime1 > fromTime2)
        ) {
          res.send({ error: null, reserved: true, wrongTime: false });
          return;
        }
      }
      res.send({
        error: null,
        reserved: false,
        wrongTime: false
      });
    })
    .catch(err => {
      console.error(err);
      res.status(400).send({ error: err });
    });
});

router.post("/checkUser", (req, res) => {
  // console.log(req.body);
  // User.findOne({ username: req.body.username, password: req.body.password })
  //   .then(doc => {
  //     if (doc) {
  //       res.send({ error: null, message: "auth" });
  //     } else {
  //       res.send({ error: null, message: "not-auth" });
  //     }
  //   })
  //   .catch(err => {
  //     console.error(err);
  //     res.status.send({ error: err });
  //   });

  User.findOne({ username: req.body.username })
    .then(user => {
      if (!user) {
        // res.render("login", { title: "ورود" });
        res.send({ error: null, auth: false });
        return;
      }
      bcrypt.compare(req.body.password, user.password, (err, resPassword) => {
        if (resPassword) {
          // var token = jwt.sign(
          //   { _id: admin._id.toHexString(), username: admin.username },
          //   superSecret
          // );
          res.send({ error: null, auth: true, password: true });

          // res.redirect(
          //   "/manage/managePage" + "?auth=" + encodeURIComponent(token)
          // );
        } else {
          // res.render("login", { title: "ورود" });
          res.send({ error: null, auth: true, password: false });
        }
      });
    })
    .catch(err => {
      console.error(err);
      res.status(400).send({ error: err });
    });
});

module.exports = router;
