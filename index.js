const express = require("express");
const { connection } = require("./config/db");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { userRouter } = require("./routes/user.route");
const { PostRouter } = require("./routes/posts.route");
const { authenticate } = require("./middleware/authenticate.middleware");

app.use(express.json());
app.use(cors());
app.use("/users", userRouter);
app.use(authenticate);
app.use("/posts", PostRouter);
app.listen(process.env.PORT, async () => {
  try {
    await connection;
  } catch (err) {
    console.log(err.message);
  }
  console.log(`server is running at port ${process.env.PORT}`);
});
