"use strict";

const universal = require("../../constants/index.js");
const MODELS = require("../../models/index");

module.exports = {
  tipCalculate: tipCalculate,
}


function tipCalculate(req, res, next) {
  async function tipCalculate() {
    try {
      console.log("hyyy TIP!");
    } catch (err) {
      next(err);
    }
  }
  tipCalculate().then(function () { });
}
