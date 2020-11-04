const app = require("express");
const router = new app.Router();
const MemberShip = require("../models/Membership.model");

/**********************************s
 *  GET - /membership/get
 ************************************/
router.get("/all", (req, res, next) => {
  // console.log("/membership/all =>");

  MemberShip.find()
    .then((membershipInfo) =>
      res
        .status(200)
        .json({ success: "all membership details", membershipInfo })
    )
    .catch((error) =>
      res
        .status(200)
        .json({ errorMessage: "error fetching membership info ", error })
    );
});

module.exports = router;
