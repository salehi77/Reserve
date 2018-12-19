const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// const Admin = mongoose.model("Admin", {
//   username: {
//     type: String
//   },
//   password: {
//     type: String
//   }
// });

var AdminSchema = new mongoose.Schema({
  username: {
    type: String
  },
  password: {
    type: String
  },
  tokens: [
    {
      access: { type: String },
      token: { type: String }
    }
  ]
});

AdminSchema.methods.toJSON = function() {
  let adminObject = this.toObject();
  return {
    _id: adminObject._id,
    username: adminObject.username
  };
};

AdminSchema.methods.generateAuthToken = function() {
  var access = "auth";
  var token = jwt.sign({ _id: this._id.toHexString(), access }, "123abc");

  this.tokens.push({ access, token });

  return this.save().then(() => {
    return token;
  });
};

AdminSchema.statics.findByToken = function(token) {
  let decoded;
  try {
    decoded = jwt.verify(token, "123abc");
  } catch (e) {
    return Promise.reject();
  }

  return Admin.findOne({
    _id: decoded._id,
    "tokens.token": token,
    "tokens.access": "auth"
  });
};

AdminSchema.statics.findByCredentials = function(username, password) {
  return this.findOne({ username }).then(admin => {
    if (!admin) {
      return Promise.reject();
    }
    return new Promise((reslove, reject) => {
      bcrypt.compare(password, admin.password, (err, res) => {
        res ? reslove(admin) : reject();
      });
    });
  });
};

AdminSchema.pre("save", function(next) {
  if (this.isModified("password")) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(this.password, salt, (err, hash) => {
        this.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
