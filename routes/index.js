const path = require("path");
const express = require("express");
const router = express.Router();

const Place = require("./../database/models/place");
const Request = require("./../database/models/request");

router.get("/", function(req, res, next) {
  res.render("home", { title: "خانه" });
});

router.get("/place-list", (req, res) => {
  res.render("place-list", { title: "لیست فضاها" });
});

router.get("/getPlaces", (req, res) => {
  Place.find({})
    .select("-_id -ID")
    .then(
      docs => {
        res.send({ error: null, places: docs });
      },
      err => {
        console.error("error");
        res.status(400).send({ error: err });
      }
    );
});

router.get("/followReserve", (req, res) => {
  res.render("follow-reserve", { title: "پیگیری رزرو" });
});

router.get("/getRequest", (req, res) => {
  Request.findOne({ followCode: req.query.code })
    .select("requestDate date time placeID followCode -_id")
    .then(doc => {
      if (!doc) {
        return res.send({ message: "no-request" });
      }
      Place.findOne({ ID: doc.placeID }).then(pdoc => {
        if (pdoc) {
          let newdoc = {
            requestDate: doc.requestDate,
            place: pdoc.name,
            time: doc.time,
            date: doc.date,
            followCode: doc.followCode
          };
          res.send(newdoc);
        }
      });
    })
    .catch(err => {
      console.error(err);
      res.status(400).send(err);
    });
});

module.exports = router;
