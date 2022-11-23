const router = require("express").Router();
const User = require("../models/Users");
const bcrypt = require("bcrypt");

//update users route
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        res.status(500).json(err);
      }
    }
    try {
      const newUser = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).send("account updated");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can only update your own account");
  }
});

//delete user
router.delete("/delete/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.user.isAdmin) {
    try {
      const deletedUser = await User.deleteOne(req.params.id);
      res.status(200).send("account deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can only delete your own account");
  }
});
module.exports = router;
