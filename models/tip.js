const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const TipModel = new Schema({
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });


const Tip = mongoose.model('tips', TipModel);
module.exports = Tip;
