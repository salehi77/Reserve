const path = require("path");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const Place = require("./../database/models/place");
const Admin = require("../database/models/admin");
const User = require("../database/models/user");

const superSecret = "123abc";

router.get("/login", (req, res) => {
  res.render("login", { title: "ورود" });
});

let authenticate = (req, res, next) => {
  let token = req.header("x-auth") || req.query.auth;

  let decoded;
  try {
    decoded = jwt.verify(token, superSecret);
    req.decoded = decoded;
    // req.token = token;
    next();
  } catch (err) {
    res.status(401).send(err);
  }
};

router.get("/managePage", authenticate, (req, res) => {
  res.render("manage-page", { title: "مدیریت" });
});

router.post("/managePage", (req, res) => {
  Admin.findOne({ username: req.body.username })
    .then(admin => {
      if (!admin) {
        res.render("login", { title: "ورود" });
        return;
      }
      bcrypt.compare(req.body.password, admin.password, (err, resPassword) => {
        if (resPassword) {
          var token = jwt.sign(
            { _id: admin._id.toHexString(), username: admin.username },
            superSecret
          );

          res.redirect(
            "/manage/managePage" + "?auth=" + encodeURIComponent(token)
          );
        } else {
          res.render("login", { title: "ورود" });
        }
      });
    })
    .catch(err => {
      console.error(err);
      res.render("login", { title: "ورود" });
    });
});

router.post("/addPlace", authenticate, (req, res) => {
  async function f() {
    let doc = true;
    while (doc) {
      var randomID = Math.floor(Math.random() * 100000) + 10000;
      doc = await Place.findOne({ ID: randomID });
    }
    let newPlace = new Place({
      ID: randomID,
      name: req.body.name,
      type:
        req.body.type === "class"
          ? "کلاس"
          : req.body.type === "seminar"
          ? "سمینار"
          : "تالار",
      capacity: req.body.capacity,
      equipment: {
        projector: req.body.projector ? true : false,
        computer: req.body.computer ? true : false,
        board: req.body.board ? true : false,
        wifi: req.body.wifi ? true : false
      }
    });
    newPlace
      .save()
      .then(doc => {
        res.send({ error: null, message: "success" });
      })
      .catch(err => {
        res.send({ error: err });
      });
  }

  f();
});

router.post("/addUser", authenticate, (req, res) => {
  // console.log(req.body);
  res.send("success");
});

router.post("/addadmin", (req, res) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      let admin = new Admin({
        username: req.body.username,
        password: hash
      });

      admin
        .save()
        .then(() => {
          res.send("success");
        })
        .catch(err => {
          console.error(err);
          res.status(400).send(err);
        });
    });
  });
});

module.exports = router;
