const express = require("express");
const mongoose = require("mongoose");
const Song = require("../models/Song");
const passport = require("passport");

const router = express.Router();

router.post(
  "/add/song",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { name, thumbnail, track } = req.body;
    console.log(artist);

    if (!name || !thumbnail || !track) {
      return res.status(301).json({ error: "Insufficient song details" });
    }

    try {
      const newSong = new Song({
        name,
        thumbnail,
        track,
        artist,
      });
      await newSong.save();
      res.json({ newSong });
    } catch (error) {
      res.status(400).json({ err: "Not authenticate" });
    }
  }
);
router.get(
  "/get/song",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {

    const userSongs = await Song.find({artist: req.user._id});
    res.json({data: userSongs});

  }
);

module.exports = router;
