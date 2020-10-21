const app = require("express");
const router = new app.Router();
const User = require("../models/User.model");
const Session = require("../models/Session.model");
const mongoose = require("mongoose");

/**********************************
 *  POST - /user/edit
 ************************************/
router.post("/edit", (req, res) => {
  console.log("/user/edit =>", req.headers.accesstoken);
  console.log("/user/edit =>", req.body);

  const body = Object.fromEntries(
    Object.entries(req.body).filter((el) => el[1])
  );

  Session.findById({ _id: req.headers.accesstoken })
    .then((sessionFromDB) => {
      if (sessionFromDB) {
        User.findByIdAndUpdate(sessionFromDB.userId, body, {
          new: true,
        }).then((userInfo) =>
          res.status(200).json({ success: "user profile updated ", userInfo })
        );
      } else {
        return res.status(200).json({ errorMessage: "session not updated " });
      }
    })
    .catch((error) =>
      res.status(200).json({ errorMessage: "Session is not active", error })
    );
});

/**  */
module.exports = router;
