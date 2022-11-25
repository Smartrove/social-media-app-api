const express = require("express");
const app = express();
const dotenv = require("dotenv/config");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const port = process.env.PORT;

//routes init
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/posts");

//db connection
const connection = mongoose
  .connect(process.env.DB)
  .then(() => console.log(`database connection was established`))
  .catch((err) => console.log(err));

//middleware innit
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);

app.listen(port, () => console.log(`server started at port ${port}`));
