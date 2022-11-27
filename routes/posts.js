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
  try {
    const post = await Posts.findById(req.params.id);
    if (post.userId === req.body.userId) {
      const updatedPost = await Posts.updateOne({ $set: req.body });
      res.status(200).send("post updated successfully");
    } else {
      res.status(403).json("Post cannot be updated");
    }
    //
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (post.userId === req.body.userId) {
      const updatedPost = await Posts.deleteOne();
      res.status(200).send("post deleted successfully");
    } else {
      res.status(403).json("Post cannot be deleted");
    }
    //
  } catch (err) {
    res.status(500).json(err);
  }
});

//like or unlike a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).send("You liked this post");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).send("You unlike this post");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

//get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    res.status(200).send(post);
  } catch (err) {
    res.status(500).send(err);
  }
});

//get timeline posts
router.get("/timeline/posts", async (req, res) => {
  try {
    const currentUser = await Posts.findById(req.body.userId);
    const userPosts = await Posts.find({ userId: currentUser._id });
    const friendsPosts = await Promise.all(
      currentUser &&
        currentUser.following.map((friendId) => {
          return Posts.find({ userId: friendId });
        })
    );
    res.json(userPosts.concat(...friendsPosts));
  } catch (err) {
    res.status(500).send(err);
  }
});
module.exports = router;
