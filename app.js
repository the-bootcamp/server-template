require("dotenv/config");

const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
require("./config/db.config");

//Router definition
const authRouter = require("./routes/auth.route");
const userRouter = require("./routes/user.route");
const cottageRouter = require("./routes/cottage.route");
const app = express();

//CORS configuration
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
    // origin: process.env.ORIGIN,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/cottage", cottageRouter);

module.exports = app;
