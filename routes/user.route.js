const app = require("express");
const router = new app.Router();
const Subscriptions = require("../models/Subscription.model");
const mongoose = require("mongoose");
const Session = require("../models/Session.model");
const User = require("../models/User.model");
const MemberShip = require("../models/Membership.model");
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const uuid = require("uuid");

const stripe = require("stripe")(process.env.PAYMENT_PRIVATEKEY);

const nodemailer = require("nodemailer");

/**********************************
 *  POST - /user/edit
 ************************************/
router.post("/edit", (req, res) => {
  console.log("/user/edit =>", req.body);

  const body = Object.fromEntries(
    Object.entries(req.body).filter((el) => el[1])
  );
  let password = req.body.password ? req.body.password : "";

  Session.findById({ _id: req.headers.accesstoken })
    .then((sessionFromDB) => {
      if (sessionFromDB) {
        /** If password is changed ... */
        if (password) {
          const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
          if (!regex.test(password)) {
            return res.status(200).json({
              errorMessage:
                "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
            });
          } // password format
          // generate bycrypt salts
          bcryptjs
            .genSalt(saltRounds)
            .then((salt) => bcryptjs.hash(password, salt))
            .then((hashedPassword) => {
              body.password = hashedPassword;
              updateUser(sessionFromDB, body, res);
            });
        }
        if (!password) {
          updateUser(sessionFromDB, body, res);
        }
      } else {
        return res.status(200).json({ errorMessage: "session not active " });
      }
    })
    .catch((error) =>
      res.status(200).json({ errorMessage: "Session is not active", error })
    );
});

/**
 *
 * @param {*} sessionFromDB
 * @param {*} body
 * @param {*} res
 */
const updateUser = (sessionFromDB, body, res) => {
  User.findByIdAndUpdate(sessionFromDB.userId, body, { new: true })
    .then((userInfofromDB) => {
      MemberShip.findOne(
        { membership: userInfofromDB.membership },
        { _id: 0, cottagetype: 1 }
      ).then((cottagetype) => {
        return res.status(200).json({
          success: "user profile updated ",
          userInfo: {
            ...userInfofromDB.toObject(),
            ...cottagetype.toObject(),
          },
        });
      });
    })
    .catch((error) =>
      res.status(200).json({ errorMessage: "Session is not active", error })
    );
};

/**********************************
 *  POST - /user/subscribe/:email
 ************************************/
router.post("/subscribe/:email", (req, res, next) => {
  // console.log(req.params.email);
  if (!req.params.email) {
    return res.status(200).json({
      errorMessage: "Email-Id is empty.",
    });
  }

  Subscriptions.create({
    email: req.params.email,
    createdAt: Date.now(),
  })
    .then((res) => {
      return res.status(200).json({ success: "User is sunscribed" });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(200).json({ errorMessage: error.message });
      } else if (error.code === 11000) {
        return res.status(200).json({
          errorMessage:
            "Email need to be unique. Either username or email is already used.",
        });
      }
      // else {
      //   return res.status(500).json({ errorMessage: error });
      // }
    }); // close .catch()
});

/**
 */
router.post("/payment", async (req, res) => {
  console.log("Request:", req.body);

  let error;
  let status;
  try {
    const { product, token } = req.body;
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const idempotency_key = uuid();
    const charge = await stripe.charges.create(
      {
        amount: product.price * 100,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: `Purchased the ${product.name}`,
        shipping: {
          name: token.card.name,
          address: {
            line1: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.card.address_city,
            country: token.card.address_country,
            postal_code: token.card.address_zip,
          },
        },
      },
      {
        idempotency_key,
      }
    );
    console.log("Charge:", { charge });
    status = "success";
  } catch (error) {
    console.error("Error:", error);
    status = "failure";
  }

  res.json({ error, status });
});

/**  */
module.exports = router;
