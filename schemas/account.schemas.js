var mongoose = require('mongoose');

var AccountSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    fullName: String
  },
  {
    versionKey: false,
    timestamps: true
  }
);

module.exports = mongoose.model('Account', AccountSchema, 'accounts');