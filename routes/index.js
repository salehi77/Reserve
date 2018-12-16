const path = require("path");
const express = require("express");
const router = express.Router();

const Place = require("./../database/models/place");

router.get("/", function(req, res, next) {
  res.render("home", { title: "خانه" });
});

router.get("/place-list", (req, res) => {
  res.render("place-list", { title: "لیست مکان ها" });
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

router.get("/login", (req, res) => {
  res.send("you are login");
});

// router.get("/submit-request", (req, res) => {
//   Request.find({})
//     .select("ID -_id")
//     .sort("ID")
//     .then(docs => {
//       console.log(docs);
//       var requestID = docs.length == 0 ? 1 : docs[docs.length - 1].ID + 1;
//       console.log("requestID  " + requestID + "\n");
//       var request = new Request({ ID: requestID });
//       request.save(function(err, doc) {
//         if (err) return console.error(err);
//         res.send({ error: null, requestID: doc.ID });
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(400).send({ error: err });
//     });
// });

// router.get("/rsv", (req, res) => {
//   switch (req.query.step) {
//     case "1":
//       res.render("rsv_1");
//       break;
//     case "2":
//       res.render("rsv_2_aca", { requestID: req.query.requestID });
//       break;
//     case "3":
//       Place.find({})
//         .then(docs => {
//           res.render("rsv_3", { docs });
//         })
//         .catch(err => {
//           console.log(err);
//           res.status(400).send(err);
//         });

//       break;
//   }
// });

// router.post("/rsv", (req, res) => {
//   // console.log(req.body);
//   // console.log(req.query);
//   switch (req.query.step) {
//     case "2":
//       Request.findOneAndUpdate(
//         { ID: req.query.requestID },
//         {
//           $set: {
//             academic: req.body.academic
//           }
//         },
//         (err, doc) => {
//           if (err) return console.error(err);
//           if (req.body.academic == "academic" || true) {
//             res.redirect("/rsv?step=2&requestID=" + req.query.requestID);
//           }
//         }
//       );
//       break;
//     case "3":
//       Request.findOneAndUpdate(
//         { ID: req.query.requestID },
//         {
//           $set: {
//             personDetail: {
//               firstname: req.body.firstname,
//               lastname: req.body.lastname,
//               employeeNumber: req.body.employeeNumber,
//               telNumber: req.body.telNumber,
//               mobNumber: req.body.mobNumber
//             },
//             planDetail: {
//               subject: req.body.subject,
//               level: req.body.level,
//               sponserName: req.body.sponserName,
//               sponserTel: req.body.sponserTel
//             },
//             summary: req.body.summary,
//             guestDetail: {
//               totGuest: req.body.totGuest,
//               acGuest: req.body.acGuest,
//               nacGuest: req.body.nacGuest
//             }
//           }
//         },
//         (err, doc) => {
//           if (err) return console.error(err);
//           if (req.body.academic == "academic" || true) {
//             res.redirect("/rsv?step=3&requestID=" + req.query.requestID);
//           }
//         }
//       );
//       break;
//     case "4":
//       var followCode = Math.floor(Math.random() * 100000) + 10000;
//       Request.findOneAndUpdate(
//         { ID: req.query.requestID },
//         {
//           $set: {
//             placeID: req.body.placeID,
//             followCode,
//             date: {
//               year: req.body.year,
//               month: req.body.month,
//               date: req.body.date
//             },
//             time: {
//               hourFrom: req.body.hourFrom,
//               minFrom: req.body.minFrom,
//               hourTo: req.body.hourTo,
//               minTo: req.body.minTo
//             }
//           }
//         }
//       )
//         .then(doc => {
//           let newReservedTime = new ReservedTime({
//             placeID: req.body.placeID,
//             requestID: req.query.requestID,
//             date: {
//               year: req.body.year,
//               month: req.body.month,
//               date: req.body.date
//             },
//             time: {
//               hourFrom: req.body.hourFrom,
//               minFrom: req.body.minFrom,
//               hourTo: req.body.hourTo,
//               minTo: req.body.minTo
//             }
//           });

//           newReservedTime
//             .save()
//             .then(doc => {
//               // res.redirect("/rsv?step=4&requestID=" + req.query.requestID);
//               res.render("rsv_4", { followCode });
//             })
//             .catch(err => {
//               console.error(err);
//               res.send(400).send(err);
//             });
//         })
//         .catch(err => {
//           console.error(err);
//           res.send(400).send(err);
//         });
//       break;
//   }
// });

// router.post("/checkReservedTimes", (req, res) => {
//   // console.log(req.body);
//   var dateToReserve = {
//     year: req.body["dateToReserve[year]"],
//     month: req.body["dateToReserve[month]"],
//     date: req.body["dateToReserve[date]"]
//   };
//   ReservedTime.find({ placeID: req.body.placeID, date: dateToReserve })
//     .select("time -_id")
//     .then(docs => {
//       var fromTime1 =
//         parseInt(req.body["timeToReserve[hourFrom]"]) * 3600 +
//         parseInt(req.body["timeToReserve[minFrom]"]) * 60;
//       var toTime1 =
//         parseInt(req.body["timeToReserve[hourTo]"]) * 3600 +
//         parseInt(req.body["timeToReserve[minTo]"]) * 60;
//       if (fromTime1 >= toTime1) {
//         res.send({ reserved: false, wrongTime: true });
//         return;
//       }
//       var sendToUser = true;
//       for (var i = 0; i < docs.length; ++i) {
//         var fromTime2 =
//           parseInt(docs[i].time.hourFrom) * 3600 +
//           parseInt(docs[i].time.minFrom) * 60;
//         var toTime2 =
//           parseInt(docs[i].time.hourTo) * 3600 +
//           parseInt(docs[i].time.minTo) * 60;

//         if (
//           (fromTime1 >= fromTime2 && fromTime1 < toTime2) ||
//           (toTime1 <= toTime2 && toTime1 > fromTime2)
//         ) {
//           res.send({ reserved: true, wrongTime: false });
//           return;
//         }
//       }
//       res.send({ reserved: false, wrongTime: false });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(400).send(err);
//     });
// });

module.exports = router;
