const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const User = require("../models/User");
const router = require("express").Router();

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    const hashedPass = CryptoJS.AES.decrypt(user.password, "pass");

    const originalPassword = hashedPass.toString(CryptoJS.enc.Utf8);

    if (originalPassword != req.body.password) {
      res.status(401).json("Wrong credentials!");
      return;
    }
    const accessToken = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      "pass",
      { expiresIn: "1d" }
    );
    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
