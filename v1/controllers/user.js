"use strict";

const universal = require("../../constants/index.js");
const MODELS = require("../../models/index");
const crypto = require('crypto');
const loadsh = require('lodash');
const uuid = require('uuid');
const mailer = require('../../constants/mailer/mailer');

module.exports = {
  signIn: signIn,
  signUp: signUp,
  getImage: getImage,

}

function signUp(req, res, next) {
  async function signUp() {
    try {
      if (!req.files) {
        throw "You need to upload image !"
      }
      let user = await MODELS.user
        .findOne({ email: req.body.email, isDeleted: false })
        .select("email")
        .lean()
        .exec();
      if (user)
        return await res.json(
          universal.RESPONSE(universal.CODES.BAD_REQUEST, universal.MESSAGES.USER_ALREADY_EXIST, null)
        );
      //upload image
      const file = req.files.image;
      const randomName = uuid.v4();
      const extension = file.name.substr(file.name.lastIndexOf('.'));
      file.mv('./uploads/' + randomName + extension);

      // Add product
      // console.log("req.ody:   ", req.body);
      var newUser = req.body;
      const userDetails = new MODELS.user();
      userDetails.name = newUser['name'];
      userDetails.email = newUser['email'];
      userDetails.password = newUser['password'];
      userDetails.image = randomName + extension;
      userDetails.password = await universal.UTILS.hashUsingBcrypt(userDetails.password);
      req.body.salt = crypto.randomBytes(16).toString('hex');
      const addedUser = await MODELS.user(userDetails).save();
      // console.log("addedUser:   ", addedUser);
      console.log(`User registered Successfully!`);
      return await res.json(
        universal.RESPONSE(universal.CODES.CREATED, universal.MESSAGES.ADDED_SUCCESS, { name: addedUser.name, email: addedUser.email })
      );
    } catch (err) {
      next(err);
    }
  }
  signUp().then(function () { });
}

function signIn(req, res, next) {
  async function signIn() {
    try {
      let user = {};
      if (req.body.email) {
        user = await MODELS.user
          .findOne({ email: req.body.email, isDeleted: false })
          .lean()
          .exec();
      } else {
        return await res.json(
          res,
          universal.CODES.BAD_REQUEST,
          universal.MESSAGES.USER_DOEST_NOT_EXIST,
          {},
          req.lang
        );
      }
      if (!user)
        return await res.json(
          universal.RESPONSE(universal.CODES.BAD_REQUEST, universal.MESSAGES.USER_DOEST_NOT_EXIST, null)
        );
      let isMatched = await universal.UTILS.compareUsingBcrypt(
        req.body.password,
        user.password
      );
      if (!isMatched)
        return await res.json(
          universal.RESPONSE(universal.CODES.UN_AUTHORIZED, universal.MESSAGES.INVALID_LOGIN_CREDENTIALS, null)
        );
      let token = await universal.UTILS.jwtSign({ _id: user._id });
      let userData = await MODELS.user.findByIdAndUpdate(user._id, { authToken: token }, { new: true });
      userData.authToken = token;
      console.log(`User LoggedIn Successfully!`);
      return await res.json(
        universal.RESPONSE(universal.CODES.OK, universal.MESSAGES.LOGIN_SUCESS, { name: userData.name, authToken: userData.authToken })
      );
    } catch (err) {
      next(err);
    }
  }
  signIn().then(function () { });
}

function getImage(req, res, next) {
  async function getImage() {
    try {
      console.log("image access!");
    } catch (err) {
      next(err);
    }
  }
  getImage().then(function () { });
}
