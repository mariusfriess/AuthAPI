var mongoose = require('mongoose');
var Account = require('../schemas/account.schemas');
var jwt = require('jsonwebtoken');
const crypto = require('crypto');
var randomstring = require("randomstring");


// SECRET FOR JWT GENERATION
var secret = "-8e*4Vn\758G?lI%nVLyFR4ZHc)1}\CHhy%>kz&BT7:?cX>pbUsK%n.L/FIlIj";
const sha256 = x => crypto.createHash('sha256').update(x, 'utf8').digest('hex');


var db = mongoose.connection;
db.once('open', function(){
  console.log('database opened successfully');
})
db.on('error', console.error.bind(console, 'connection error:'))



var AccountAPI = {

  // LOGIN REQUEST HANDLER
  login: function(request, response){
    Account.findOne({username: request.body.username}).exec(function(err, user){
      if(err){
        response.status(500).json(err);
      }else if(!user){
        response.status(200).json({
          code: 'no-user',
          message: 'no user with this username was found'
        })
      }else if(user){
        if(user.password == request.body.password){
          jwt.sign({
            username: user.username,
            fullName: user.fullName,
            userId: user._id
          }, secret, {expiresIn: '30d'}, function(error, token){
            if(token){
              response.status(200).json({
                code: 'success',
                message: 'jwt successfully sent',
                token: token
              })
            }else{
              response.status(200).json({
                code: 'jwt-error',
                message: 'an error occurred while creating a jwt'
              })
            }
          })
        }
      }else{
        response.status(200).json({
          code: 'wrong-password',
          message: 'the password is not correct'
        })
      }
    })
  },


  // CHECK IF USERNAME EXISTS
  checkUsername: function(request, response){
    Account.findOne({username: request.body.username}).exec(function(err, user){
      if(err){
        response.status(500).json(error);
      }else if(!user){
        response.status(200).json({
          code: 'no-user',
          message: 'no user with this username was found'
        })
      }else{
        response.status(200).json({
          code: 'user-already-exists',
          message: 'a user with this username does already exist'
        });
      }
    })
  },


  // CREATE NEW USER ACCOUNT
  createNewAccount: function(request, response){
    var hashToken = randomstring.generate({
      length: 16,
      charset: 'hex'
    })
    var hashedPassword = sha256(request.body.password + hashToken)
    var result = db.collection('accounts').insert({
      username: request.body.username,
      password: hashedPassword,
      fullName: request.body.fullName,
      hashToken: hashToken
    }, function(err, user){
      if(user){
        var userinfo = user.ops[0];
        jwt.sign({
          username: userinfo.username,
          fullName: userinfo.fullName,
          userId: userinfo._id
        }, secret, {expiresIn: '7d'}, (error, token) => {
          if(token){
            response.status(200).json({
              code: 'success',
              message: 'account created',
              token: token
            })
          }else{
            response.status(500)
          }
        })
      }else{
        response.status(500);
      }
    })
  }


}

module.exports = AccountAPI;