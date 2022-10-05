const User = require("../models/User");
const router = require("express").Router();
const CryptoJS = require("crypto-js");

//REGISTER
router.post("/register", async (req, res) => {
  if (
    req.body.username !== "" &&
    req.body.email !== "" &&
    req.body.password.length >= 6
  ) {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(req.body.password, "pass").toString(),
    });
    try {
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    console.log(
      "Username and email required, password must be longer than 5char"
    );
    res.status(400).end();
  }
});

module.exports = router;
