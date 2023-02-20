const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { userModel } = require("../model/user.model");
const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  try {
    const { name, password, email, age, city, gender } = req.body;
    const userExist = await userModel.find({ email });
    if (userExist.length > 0) {
      res.send({ msg: "user already exist , please login" });
    } else {
      bcrypt.hash(password, 5, async (err, hash) => {
        if (err) {
          res.send({
            msg: "something went wrong with password",
            error: err.message,
          });
        } else {
          const user = new userModel({
            name,
            email,
            age,
            city,
            gender,
            password: hash,
          });
          await user.save();
          res.send({ msg: "User Registered Successfull" });
        }
      });
    }
  } catch (err) {
    res.send({
      msg: "something went wrong with password in catch block",
      error: err.message,
    });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.find({ email });
    if (user.length > 0) {
      bcrypt.compare(password, user[0].password, (err, result) => {
        if (result) {
          let token = jwt.sign(
            {
              userId: user[0]._id,
            },
            process.env.SECRET
          );
          res.send({ msg: "user loged in ", token: token });
        } else {
          res.send({ msg: "wrong crednetials1" });
        }
      });
    } else {
      res.send({ msg: "wrong crednetials 2" });
    }
  } catch (err) {
    res.send({
      msg: "something went wrong  in login catch block",
      error: err.message,
    });
  }
});

module.exports = {
  userRouter,
};
