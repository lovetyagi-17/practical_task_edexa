"use strict";

const universal = require("../../constants/index.js");
const MODELS = require("../../models/index");
var counter = 0;
module.exports = {
  tipCalculate: tipCalculate,
  getTipData: getTipData
}

function tipCalculate(req, res, next) {
  async function tipCalculate() {
    try {
      let hotel_data = await MODELS.hotel.findOne({place: req.body.place}).lean().exec();
      if(!hotel_data) {
        counter = 0;
        let hotel_data = await MODELS.hotel(req.body).save();
        let tipAmount = (hotel_data.totalAmount * hotel_data.tipPercentage) / 100;
        let updatedData = await MODELS.hotel.findByIdAndUpdate(hotel_data._id,
          {
            $set : { tip: tipAmount, counter : 2 }
          },
          { new: true });
        if(updatedData) {
            return await res.json(
              universal.RESPONSE(universal.CODES.OK, universal.MESSAGES.ADDED_SUCCESS, { tip: updatedData.tip })
            )
          }
      } else {
        let updatedData = await MODELS.hotel.findOne({_id: hotel_data._id}).lean().exec();
        if(updatedData) {
            return await res.json(
              universal.RESPONSE(universal.CODES.OK, universal.MESSAGES.UPDATE_SUCCESS, { tip: updatedData.tip })
            )
          }
      }
      return await res.json(
        universal.RESPONSE(universal.CODES.INTERNAL_SERVER_ERROR, universal.MESSAGES.INTERNAL_ERROR, null)
      )
    } catch (err) {
      next(err);
    }
  }
  tipCalculate().then(function () { });
}

function getTipData(req, res, next) {
  async function getTipData() {
    try {
      let analyticsType = req.query.analyticsType;
      let startDate = req.query.startDate
      let endDate = req.query.endDate;
      console.log(analyticsType, startDate);
      if(analyticsType === "mostVisitedPlaces"){
        let hotelData = await MODELS.hotel.find({
          startDate: {
            $gte: startDate,
            $lt: endDate
          }}
        ).sort({counter: -1}).limit(1);
        if(hotelData) {
          console.log(`List of Most Visited Hotels!`);
          return await res.json(
            universal.RESPONSE(universal.CODES.OK, universal.MESSAGES.FETCH_SUCCESS,
              { place: hotelData[0].place, noOfTimes:hotelData[0].counter }
              )
          );
        }
        return await res.json(
          universal.RESPONSE(universal.CODES.NO_CONTENT, universal.MESSAGES.NO_DATA_FOUND, null)
        );
      } else if(analyticsType === "tipPercentage") {
        let hotelData = await MODELS.hotel.find({
          startDate: {
            $gte: startDate,
            $lt: endDate
          }}).sort({tipPercentage: -1}).limit(1);
        if(hotelData) {
          console.log(`List of Most Used Tip Hotels!`);
          return await res.json(
            universal.RESPONSE(universal.CODES.OK, universal.MESSAGES.FETCH_SUCCESS,
              { tipPercentage: hotelData[0].tipPercentage, noOfTimes:hotelData[0].counter }
              )
          );
        }
        return await res.json(
          universal.RESPONSE(universal.CODES.NO_CONTENT, universal.MESSAGES.NO_DATA_FOUND, null)
        );
      }
      // let allHotels = await MODELS.hotel.find({
      //   startDate: {
      //     $gte: startDate,
      //     $lt: endDate
      //   }
      // }).lean().exec();
      let allHotels = await MODELS.hotel.find().lean().exec();
      // console.log(allHotels);
        if(allHotels) {
          console.log(`All hotels List!`);
          return await res.json(
            universal.RESPONSE(universal.CODES.OK, universal.MESSAGES.FETCH_SUCCESS, allHotels)
          );
        }
      return await res.json(
        universal.RESPONSE(universal.CODES.NO_CONTENT, universal.MESSAGES.NO_DATA_FOUND, null)
      )
    } catch(err) {
      next(err);
    }
  }
  getTipData().then(function () { });
}
