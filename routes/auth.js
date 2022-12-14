const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const bcrypt = require("bcrypt");

//register user routes
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    const userSaved = await newUser.save();
    res.status(200).json(userSaved);
  } catch (err) {
    res.status(500).json(err);
  }
});

//login user
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    !user && res.status(404).json("user not found");
    const validPassword = await bcrypt.compareSync(
      req.body.password,
      user.password
    );
    !validPassword && res.status(404).json("password incorrect");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
