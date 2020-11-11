const app = require("express");
const router = new app.Router();
const MemberShip = require("../models/Membership.model");

/**********************************s
 *  GET - /membership/get
 ************************************/
router.get("/:membership", (req, res, next) => {
  console.log("/membership/membership =>", req.params.membership);
  const searchQuery =
    req.params.membership === "all"
      ? ""
      : req.params.membership.toLowerCase().trim();

  MemberShip.find({ membership: { $regex: searchQuery } })
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
