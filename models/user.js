const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserModel = new Schema({
  name: {
    type: String,
    default: null
  },
  email: {
    type: String,
    default: null
  },
  password: {
    type: String,
    default: null
  },
  image: {
    type: String,
    default: null
  },
  authToken: {
    type: String,
    default: null
  },
  salt: { type: String },
  isActive: {
    type: Boolean,
    default: false
  },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
UserModel.index({ email: 1 });

const User = mongoose.model('users', UserModel);
module.exports = User;
