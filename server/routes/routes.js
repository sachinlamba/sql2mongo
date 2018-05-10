var express = require('express');
var router = express.Router();
var mongoose   = require('mongoose');
var mysql = require('mysql');

router.get('/', function(req, res){

  var db = mongoose.connect('mongodb://sachin:lamba@ds253587.mlab.com:53587/ppsample', function(error){
      if(error) console.log(error);
      console.log("connection successful with mongodb");
  });

  // var connection = mysql.createConnection({
  //   host     : 'localhost',
  //   user     : 'dbuser',
  //   password : 's3kreee7',
  //   database : 'my_db'
  // });
  //
  // connection.connect()
  //
  // connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
  //   if (err) throw err
  //
  //   console.log('connection successful with sql', rows[0].solution)
  // })
  //
  // connection.end();

  res.render('index')
});

router.route('/connect2MongoDB')
  .post(function(req, res) {
    var user = req.body.user,
        password = req.body.password,
        url = req.body.url,
        port = req.body.port,
        collection = req.body.collection;
    var db = mongoose.connect("mongodb://" + user + ":" + password + "@" + url + ":" + port + "/" + collection, function(error){
      if (error){
        res.send(error);
      }
      console.log("connection successful with mongodb from POST!");
      res.send({result: true, message: "Successfully connected with MongoDB!"});
    });
});

module.exports = router;
