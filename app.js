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
const bookingRouter = require("./routes/booking.route");
const membershipRouter = require("./routes/membership.route");
const app = express();

//CORS configuration
app.use(
  cors({
    credentials: true,
    // origin: "http://localhost:3000",
    origin: process.env.ORIGIN,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/cottage", cottageRouter);
app.use("/booking", bookingRouter);
app.use("/membership", membershipRouter);
module.exports = app;
