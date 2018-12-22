const expect = require("expect");
const request = require("supertest");

const app = require("./../app");
const Request = require("./../database/models/request");

beforeEach(done => {
  Request.deleteMany({}).then(() => done());
});

describe("POST /reserveProc/checkReservedTimes", () => {
  it("should return all things is ok", done => {
    request(app)
      .post("/reserveProc/checkReservedTimes")
      .send({
        placeID: 1,
        dateToReserve: { year: 1397, month: 10, date: 10 },
        timeToReserve: { hourFrom: 8, minFrom: 0, hourTo: 9, minTo: 0 }
      })
      .expect(200)
      .expect(res => {
        expect(res.body.error).toBe(null);
        expect(res.body.reserved).toBe(false);
        expect(res.body.wrongTime).toBe(false);
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("should return wrong time", done => {
    request(app)
      .post("/reserveProc/checkReservedTimes")
      .send({
        placeID: 1,
        dateToReserve: { year: 1397, month: 10, date: 10 },
        timeToReserve: { hourFrom: 10, minFrom: 0, hourTo: 9, minTo: 0 }
      })
      .expect(200)
      .expect(res => {
        expect(res.body.error).toBe(null);
        expect(res.body.reserved).toBe(false);
        expect(res.body.wrongTime).toBe(true);
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("should return reserved", done => {
    let newRequest = new Request({
      placeID: 1,
      date: { year: "1397", month: "10", date: "10" },
      time: {
        hourFrom: "8",
        minFrom: "0",
        hourTo: "9",
        minTo: "0"
      }
    });
    newRequest.save().then(doc => {
      request(app)
        .post("/reserveProc/checkReservedTimes")
        .send({
          placeID: 1,
          dateToReserve: { year: "1397", month: "10", date: "10" },
          timeToReserve: {
            hourFrom: "8",
            minFrom: "0",
            hourTo: "9",
            minTo: "0"
          }
        })
        .expect(200)
        .expect(res => {
          expect(res.body.error).toBe(null);
          expect(res.body.reserved).toBe(true);
          expect(res.body.wrongTime).toBe(false);
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
  });
});
