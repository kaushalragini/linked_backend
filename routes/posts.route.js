const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const PostRouter = express.Router();

const { PostModel } = require("../model/posts.model");

PostRouter.get("/", async (req, res) => {
  try {
    const query = req.body.query;
    const posts = await PostModel.find(query);
    res.send({ data: posts });
  } catch (err) {
    console.log(err);
    res.send({ msg: "something went wrog", error: err });
  }
});
PostRouter.get("/top", async (req, res) => {
  try {
    const userId_in_req = req.body.author;
    const posts = PostModel.find({ author: userId_in_req })
      .sort({
        no_if_comments: "desc",
      })
      .limit(1);

    res.send({ data: posts });
  } catch (err) {
    console.log(err);
    res.send({ msg: "something went wrog", error: err });
  }
});

PostRouter.post("/create", async (req, res) => {
  try {
    const post = PostModel(req.body);
    await post.save();
    res.send({ msg: "Post Saved" });
  } catch (err) {
    res.send({ msg: "not able to post" });
  }
});

PostRouter.patch("/update/:id", async (req, res) => {
  const payload = req.body;
  const id = req.params.id;
  const post = await PostModel.find({ _id: id });
  const userId_in_post = post.author;
  const userId_in_req = req.body.author;
  try {
    if (userId_in_post === userId_in_req) {
      await PostModel.findByIdAndUpdate({ _id: id }, payload);
      res.send({ msg: "Posts updated" });
    } else {
      res.send({ msg: "Not Autherised" });
    }
  } catch (err) {
    res.send({ err: err });
  }
});

PostRouter.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const post = await PostModel.find({ _id: id });
  const userId_in_post = post.author;
  const userId_in_req = req.body.author;
  try {
    if (userId_in_post === userId_in_req) {
      await PostModel.findByIdAndDelete({ _id: id });
      res.send({ msg: "Posts deleted" });
    } else {
      res.send({ msg: "Not Autherised" });
    }
  } catch (err) {
    res.send({ err: err });
  }
});

module.exports = {
  PostRouter,
};
