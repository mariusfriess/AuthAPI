var mongoose = require('mongoose');
var Account = require('../schemas/account.schemas');

function getUserByName(username){
  var query = Account.findOne({username: username})
  return query;
}

var AccountAPI = {
  loginOld: function(request, response){

    Account.find()
      .where('username').equals(request.body.username)
      .where('password').equals(request.body.password)
      .count(function(error, numRows) {
        response.status(200).json({
          count: numRows
        })
      })
  },

  login: function(request, response){

    Account.findOne({username: request.body.username}).exec(function(err, user){
      if(err){
        response.status(500).json(err);
      }else if(!user){
        response.status(200).json({
          code: 'no-user',
          message: 'no user with this username was found'
        })
      }else{
        Account.findOne({username: request.body.username, password: request.body.password}).exec(function(err, user){
          if(err){
            response.status(500).json(err);
          }else if(user){
            response.status(200).json({
              code: 'success',
              message: 'username and password were correct',
              user: {
                fullName: user.fullName,
                username: user.username,
                id: user._id
              }
            })
          }else{
            response.status(200).json({
              code: 'wrong-password',
              message: 'the password is not correct'
            })
          }
        })
      }
    })
  },

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
  }
}

module.exports = AccountAPI;