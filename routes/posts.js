const express = require("express");
const router = express.Router();
const Posts = require("../models/Posts");

//create a post
router.post("/", async (req, res) => {
  const post = new Posts(req.body);
  try {
    const newPost = await post.save();
    res.status(200).json(newPost);
  } catch (err) {
    res.status(500).send(err);
  }
});

//update post
router.put("/:id", async (req, res) => {
  const post = await Posts.findById(req.params.id);
  if (post.userId === req.body.userId) {
    try {
      //
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Post cannot be updated");
  }
});

module.exports = router;
