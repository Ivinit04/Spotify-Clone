const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, username, firstName, lastName } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(403).json({ error: "user already exists" });
    }

    const salt = await bcrypt.genSalt(10); //generate salt
    const hashedPassword = await bcrypt.hash(password, salt); //generate hashed password

    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      firstName,
      lastName,
    });
    await newUser.save();

    const jwtSecret = process.env.SECRET_KEY;
    const authToken = jwt.sign({ id: newUser._id }, jwtSecret);
    // console.log(authToken);

    res.json({
      user: newUser,
      success: true,
      token: authToken
    });
  } catch (error) {
    res.json({
      success: false
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: errors.array() });
    }

    const validPassword = await bcrypt.compare(password , user.password);

    if(!validPassword){
      return res.status(400).json({ errors: "Password is incorrect" });
    }

    const jwtSecret = process.env.SECRET_KEY;
    const authToken = jwt.sign({ id: user._id }, jwtSecret);
    // console.log(authToken);

    res.json({
      success: true,
      token: authToken
    });
  } catch (error) {
    res.json({
      success: false
    });
  }
});

module.exports = router;
