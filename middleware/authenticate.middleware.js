const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (decoded) {
        req.body.author = decoded.userId;
        next();
      } else {
        res.send({ msg: "Invalid Token passed" });
      }
    });
  } else {
    res.send({ msg: "Invalid token passed" });
  }
};
module.exports = {
  authenticate,
};
