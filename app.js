const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
require("./config/db.config");

//Router definition
const userRouter = require("./routes/auth.route");

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

app.use("/auth", userRouter);

module.exports = app;
