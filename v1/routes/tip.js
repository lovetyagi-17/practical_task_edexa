const router = require("express").Router();
const CTRL = require("../controllers/index");
/*
On-Boarding
*/
router.post("/calculate", CTRL.tip.tipCalculate);
router.get("/tip", CTRL.tip.getTipData);


module.exports = router;
