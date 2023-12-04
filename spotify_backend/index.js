const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

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

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/auth", require("./Routes/auth"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
