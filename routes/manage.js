const path = require("path");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const Admin = require("../database/models/admin");

router.get("/login", (req, res) => {
  res.render("login", { title: "ورود" });
});

let authenticate = (req, res, next) => {
  let token = req.query.auth || req.header("x-auth");

  let decoded;
  try {
    decoded = jwt.verify(token, "123abc");
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
  console.log(req.body);
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
            "123abc"
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
