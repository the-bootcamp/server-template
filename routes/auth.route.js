// routes/auth.routes.js

const { Router } = require("express");
const router = new Router();
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const User = require("../models/User.model");
const Session = require("../models/Session.model");
const mongoose = require("mongoose");
const MemberShip = require("../models/Membership.model");
const { sendRegistrationemail } = require("../utils");

/**********************************
 *  POST - /auth/signup
 ************************************/
router.post("/signup", (req, res, next) => {
  const { username, email, password, address, phone, userrole } = req.body;

  if (!username || !email || !password) {
    return res.status(200).json({
      errorMessage:
        "All fields are mandatory. Please provide your username, email and password.",
    });
  }
  // make sure passwords are strong:
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    return res.status(200).json({
      errorMessage:
        "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
  }
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        email,
        password: hashedPassword,
        address,
        phone,
        userrole,
      });
    })
    .then((user) => {
      Session.create({
        userId: user._id,
        createdAt: Date.now(),
      }).then((session) => {
        return res.status(200).json({ accessToken: session._id, user });
      });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(200).json({ errorMessage: error.message });
      } else if (error.code === 11000) {
        return res.status(200).json({
          errorMessage:
            "Username and email need to be unique. Either username or email is already used.",
        });
      } else {
        return res.status(500).json({ errorMessage: error });
      }
    }); // close .catch()
});

/**********************************
 *  POST - /auth/login
 ************************************/
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    return res.status(500).json({
      errorMessage: "Please enter both, email and password to login.",
    });
  }
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.status(200).json({
          errorMessage: "Email is not registered. Try with other email.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) {
        Session.create({
          userId: user._id,
          createdAt: Date.now(),
        }).then((session) => {
          if (!session) {
            return res
              .status(200)
              .json({ errorMessage: "Error is retrieving the session" });
          }
          // return res.status(200).json({ accessToken: session._id, user });
          if (user.userrole === "customer") {
            MemberShip.findOne(
              { membership: user.membership },
              { _id: 0, cottagetype: 1 }
            ).then((cottagetype) => {
              // sendRegistrationemail();
              return res.status(200).json({
                success: "user login success",
                accessToken: session._id,
                user: {
                  ...user.toObject(),
                  ...cottagetype.toObject(),
                },
              });
            });
          } else {
            return res.status(200).json({
              success: "manager login success",
              accessToken: session._id,
              user,
            });
          }
        });
      } else {
        return res.status(200).json({ errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => res.status(500).json({ errorMessage: err }));
});

/**********************************
 *  DELETE - /auth/logout
 ************************************/
router.delete("/logout/:id", (req, res) => {
  //   console.log("route => /logout: ", req.params.id);
  const { id } = req.params;

  Session.findByIdAndRemove({ _id: id })
    .then((session) => {
      return res.status(200).json({ success: "User was logged out" });
      session.remove;
    })
    .catch((error) => {
      return res.status(500).json({ errorMessage: error });
    });
});

/**********************************
 *  POST - /auth/session
 ************************************/
router.get("/validatesession/:accessToken", (req, res) => {
  const { accessToken } = req.params;
  Session.findById({ _id: accessToken })
    .populate("userId")
    .then((session) => {
      if (!session) {
        return res.status(200).json({
          errorMessage: "Session does not exist",
        });
      }
      // console.log(" validate session: => ", session);
      // console.log(" validate session: => ", session.userId.membership);
      // else {
      let userId = {};
      if (session.userId.userrole === "customer") {
        MemberShip.findOne(
          { membership: session.userId.membership },
          { _id: 0, cottagetype: 1 }
        ).then((cottagetype) => {
          return res.status(200).json({
            success: "user profile updated ",
            accessToken: session._id,
            userId: {
              ...session.userId.toObject(),
              ...cottagetype.toObject(),
            },
          });
        });
      } else {
        return res.status(200).json({
          success: "user profile updated ",
          accessToken: session._id,
          userId: session.userId,
        });
      }

      // return res.status(200).json({
      //   session,
      // });
      // }
    })
    .catch((err) => res.status(500).json({ errorMessage: err }));
});

/**  */
module.exports = router;
