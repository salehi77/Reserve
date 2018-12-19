const path = require("path");
const express = require("express");
const router = express.Router();

const Admin = require("../database/models/admin.backup");

router.get("/login", (req, res) => {
  res.render("login", { title: "ورود" });
});

router.post("/addadmin", (req, res) => {
  console.log(req.body);
  let admin = new Admin({
    username: req.body.username,
    password: req.body.password
  });

  admin
    .save()
    .then(() => {
      return admin.generateAuthToken();
    })
    .then(token => {
      res.header("x-auth", token).send(admin);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send(err);
    });
});

let authenticate = (req, res, next) => {
  let token = req.query.auth || req.header("x-auth");

  Admin.findByToken(token)
    .then(admin => {
      if (!admin) {
        return Promise.reject();
      }

      req.admin = admin;
      req.token = token;
      next();
    })
    .catch(err => {
      res.status(401).send(err);
    });
};

router.get("/whoami", authenticate, (req, res) => {
  res.send(req.admin);
});

router.get("/managePage", authenticate, (req, res) => {
  console.log(req.admin);
  console.log(req.token);
  res.render("manage-page", { title: "مدیریت" });
});

router.post("/managePage", (req, res) => {
  console.log(req.body);

  Admin.findByCredentials(req.body.username, req.body.password)
    .then(admin => {
      return admin.generateAuthToken().then(token => {
        // res.header("x-auth", token).render("manage-page", { title: "مدیریت" });
        // res.header("x-auth", token).redirect("/manage/managePage");
        res.redirect(
          "/manage/managePage" + "?auth=" + encodeURIComponent(token)
        );
      });
    })
    .catch(err => {
      // res.status(400).send(err);
      res.redirect("/manage/login");
    });
});

module.exports = router;
