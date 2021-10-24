const router = require("express").Router();
const CTRL = require("../controllers/index");
/*
On-Boarding
*/
router.post("/signup", CTRL.user.signUp);
router.post("/signin", CTRL.user.signIn);
router.post("/image", CTRL.user.getImage);


module.exports = router;
