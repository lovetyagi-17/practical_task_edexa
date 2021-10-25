const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const HotelModel = new Schema({
  place: {
    type: String,
    default: null
  },
  totalAmount: {
    type: Number,
    default: null
  },
  tipPercentage: {
    type: Number,
    default: null
  },
  tip: {
    type: Number,
    default: null
  },
  counter: {
    type: Number,
    default: null
  },
}, { timestamps: { createdAt: 'startDate', updatedAt: 'endDate' } });


const Hotel = mongoose.model('hotels', HotelModel);
module.exports = Hotel;
