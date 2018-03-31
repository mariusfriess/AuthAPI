var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.all('/*', function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if(req.method == 'OPTIONS'){
    res.status(200).end();
  }else{
    next();
  }
});

app.use('/api', require('./api/index'));

var server = app.listen(9090, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log("Server listening at http://%s:%s", host, port)
});