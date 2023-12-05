const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("./models/User");
const passport = require("passport");
require("dotenv").config();

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const uri = process.env.MONGO_URI;
mongoose
  .connect(uri)
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log("Error while connecting database", err);
  });

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.findOne({ _id: jwt_payload.id });  //replace id: jwt_payload.sub to _id: jwt_payload.id
    // console.log(user);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
      // or you could create a new account
    }
  } catch (err) {
    return done(err, false);
  }
}));

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/auth", require("./Routes/auth"));
app.use("/songs" , require("./Routes/songs"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
