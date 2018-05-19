var express = require('express');
var router = express.Router();
var mongoose   = require('mongoose');
var mysql = require('mysql');

var metadata = require('jdbc-metadata');

var JDBC = require('jdbc');
var jinst = require('jdbc/lib/jinst');
var Pool = require('jdbc/lib/pool');
var path = require("path");


router.get('/', function(req, res){

  // var db = mongoose.connect('mongodb://sachin:lamba@ds253587.mlab.com:53587/ppsample', function(error){
  //     if(error) console.log(error);
  //     console.log("connection successful with mongodb");
  // });
  //
  // var connection = mysql.createConnection({
  //   host     : 'den1.mssql6.gear.host',
  //   user     : 'productssql',
  //   password : 'lamba@',
  //   database : 'productssql'
  // });
  //
  // connection.connect();
  //
  // connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
  //   if (err) console.error(err);
  //
  //   console.log('connection successful with sql', rows, fields)
  // })
  //
  // connection.end();
  // var connection = mysql.createConnection({
  //   host     : 'localhost',
  //   user     : 'root',
  //   password : 'lamba',
  //   insecureAuth: true,
  //   database : 'world',
  //   port     : 3306
  // });
  //
  // connection.connect();
  //
  // connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
  //   if (err){
  //     console.log("MySQL connection fail",err);
  //     res.send(err);
  //   }else{
  //     console.log('connection successful with MySQL', rows, fields);
  //     res.send({result: true, message: "Successfully connected with MySQL!"})
  //   }
  // })

  // connection.end();

  // var jdbcConfig = {
  //     libpath: __dirname + '/../jar/mysql-connector-java-5.1.46.jar',
  //     drivername: 'com.mysql.jdbc.Driver',
  //     // url: 'jdbc:mysql://den1.mssql6.gear.host',
  //     url: 'localhost',
  //     user: 'root',
  //     password: 'lamba@',
  //     database: 'products'
  // };
  //
  // var jdbcMetadata = new metadata(jdbcConfig);
  //
  // jdbcMetadata.metadata(function (err, metadata) {
  //
  //     console.log('Getting tables...');
  //
  //     jdbcMetadata.tables(null, function (err, tables) {
  //         console.log(tables);
  //
  //         jdbcConn.close(function(err) {
  //           console.log('Connection closed');
  //         });
  //     });
  // });

  res.render('index')
});

router.route('/fetchMySQLMetadata')
  .post(function(req, res) {
    var user = req.body.user,
        password = req.body.password,
        host = req.body.host,
        port = req.body.port,
        database = req.body.database;

        if (!jinst.isJvmCreated()) {
          // Add all java options required by your project here.  You get one chance to
          // setup the options before the first java call.
          jinst.addOption("-Xrs");
          // Add all jar files required by your project here.  You get one chance to
          // setup the classpath before the first java call.
          // jinst.setupClasspath(['./jars/mysql-connector-java-5.1.38-bin.jar']);
          jinst.setupClasspath(['./jar/mysql-connector-java-5.1.46/mysql-connector-java-5.1.46-bin.jar']);
      }
      console.log(". = %s", path.resolve("."));
      console.log("__dirname = %s", path.resolve(__dirname));
      // var jdbcConfig = {
      //     libpath: __dirname + '/../jar/mysql-connector-java-5.1.46/mysql-connector-java-5.1.46.jar',
      //     drivername: 'com.mysql.jdbc.Driver',
      //     url: host,
      //     user: user,
      //     password: password,
      //     database: database
      // };
      var jdbcConfig = {
          libpath: './jar/mysql-connector-java-5.1.46/mysql-connector-java-5.1.46-bin.jar',
          drivername: 'com.mysql.jdbc.Driver',
          url: 'jdbc:mysql://localhost:3306/sakila',
          user: 'root',
          password: 'lamba@'
      };

      var jdbcMetadata = new metadata(jdbcConfig);

      jdbcMetadata.metadata(function (err, metadata) {
          if (err){
            console.log('Error metadata fetching...',err);
            res.send(err);
          }
          console.log('Getting tables...',metadata);
          var options = {schema: 'test', types: ['TABLE', 'VIEW']};

          // console.log("ewrterte");
          // jdbcMetadata.primaryKeys({}, function (err, primaryKeys) {
          //     console.log("jh  -> ",primaryKeys);
          //     res.send(primaryKeys);
          // });

          jdbcMetadata.tables(options, function (err, tables) {
            console.log("Sdfdfsdfdfvsfs");
            // if (err){
            //   console.log('Error tables fetching...');
            //   res.send(err);
            // }
              console.log("tables: ", tables);
              res.send(tables);
              // jdbcConn.close(function(err) {
              //   console.log('Error closing connection...');
              //   if (err){
              //     res.send(err);
              //   }
              //   console.log('Connection closed');
              // });
          });
      });
  })

router.route('/connect2MongoDB')
  .post(function(req, res) {
    var user = req.body.user,
        password = req.body.password,
        url = req.body.url,
        port = req.body.port,
        collection = req.body.collection;
    let connectURL = "mongodb://"  + url + ":" + port + "/" + collection
    if(user && password){
      connectURL = "mongodb://" + user + ":" + password + "@" + url + ":" + port + "/" + collection
    }
    var db = mongoose.connect(connectURL, function(error){
      if (error){
        res.send(error);
      }
      console.log("connection successful with mongodb from POST!");
      res.send({result: true, message: "Successfully connected with MongoDB!"});
    });
});

router.route('/connect2MySQL')
  .post(function(req, res) {
    var user = req.body.user,
        password = req.body.password,
        host = req.body.host,
        port = req.body.port,
        database = req.body.database;

    var connection = mysql.createConnection({
      host     : host,
      user     : user,
      password : password,
      database : database,
      port     : port
    });
    // Server=localhost\SQLEXPRESS;Database=master;Trusted_Connection=True;

    connection.connect();
    console.log(connection);
    connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
      if (err){
        console.log(err);
        console.log("MySQL connection fail");
        res.send(err);
      }else{
        console.log('connection successful with MySQL', rows, fields);
        res.send({result: true, message: "Successfully connected with MySQL!"})
      }
    })

    connection.end();

    // let connectURL = "mongodb://"  + url + ":" + port + "/" + collection
    // if(user && password){
    //   connectURL = "mongodb://" + user + ":" + password + "@" + url + ":" + port + "/" + collection
    // }
    // var db = mongoose.connect(connectURL, function(error){
    //   if (error){
    //     res.send(error);
    //   }
    //   console.log("connection successful with mongodb from POST!");
    //   res.send({result: true, message: "Successfully connected with MongoDB!"});
    // });
});

module.exports = router;
