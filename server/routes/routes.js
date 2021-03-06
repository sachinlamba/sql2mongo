var express = require('express');
var router = express.Router();
var mongoose   = require('mongoose');
var mysql = require('mysql');
var metadata = require('jdbc-metadata');

router.get('/', function(req, res){
  res.render('index')
});

router.route('/fetchMySQLMetadata')
  .post(function(req, res) {
    var user = req.body.user,
        password = req.body.password,
        host = req.body.host,
        port = req.body.port,
        database = req.body.database;

      var jdbcConfig = {
          libpath: './jar/mysql-connector-java-5.1.46/mysql-connector-java-5.1.46-bin.jar',
          drivername: 'com.mysql.jdbc.Driver',
          url: 'jdbc:mysql://' + host + '/' + database,
          user: user,
          password: password,
      };

      var jdbcMetadata = new metadata(jdbcConfig);

      jdbcMetadata.metadata(function (err, metadata) {
          if (err){
            console.log('Error metadata fetching...',err);
            res.send(err);
          }
          console.log('Getting tables...');
          // var options = {schema: 'test', types: ['TABLE', 'VIEW']};

          jdbcMetadata.tables({}, function (err, tables) {
            if (err){
              console.log('Error tables fetching...');
              res.send(err);
            }
            console.log("tables fetched.");
            var options = {schema: 'sakila'},
                tableColumns = {};
            console.log("columns fetching...");
            tables.map((tdetails, index) => {
                options['table'] =  tdetails['tableName'];
                console.log("columns fetching for table - ", options['table'], tdetails['tableName']);
                jdbcMetadata.columns(options, function (err, columns) {
                  if (err) {
                    console.log("columns errrorr..");
                  }
                    console.log("columns for ", tdetails['tableName'] , "tables -> ", index, tables.length);
                    tableColumns[tdetails['tableName']] = columns;
                  if(index == (tables.length - 1)){
                      res.send({
                        result: true,
                        message: "Successfully fetched tables from MySQL!!!",
                        tables: tables,
                        tableColumns: tableColumns
                      });
                      console.log("columns fetched...",tableColumns);
                      jdbcMetadata.close(function(err) {
                        if (err){
                          console.log('Error closing connection...');
                          res.send(err);
                        }
                        console.log('Connection closed');
                      });
                  }
                });
            })
          });
      });
  })


  router.route('/fetchTableKeys')
    .post(function(req, res) {
      var user = req.body.user,
          password = req.body.password,
          host = req.body.host,
          port = req.body.port,
          database = req.body.database,
          tableName = req.body.tableName;

        var jdbcConfig = {
            libpath: './jar/mysql-connector-java-5.1.46/mysql-connector-java-5.1.46-bin.jar',
            drivername: 'com.mysql.jdbc.Driver',
            url: 'jdbc:mysql://' + host + '/' + database,
            user: user,
            password: password,
        };

        var jdbcMetadata = new metadata(jdbcConfig);

        jdbcMetadata.metadata(function (err, metadata) {
            if (err){
              console.log('Error metadata fetching...',err);
              res.send(err);
            }
            var options = {schema: 'sakila'};
            console.log("forign keys fetching start...");
            options['table'] =  tableName;
            jdbcMetadata.importedKeys(options, function (err, importedKeys) {
              if (err) {
                console.log("fk errrorr..");
              }
                console.log("fk for ", tableName , "tables -> ", importedKeys);
                console.log("columns fetching for table - ", options['table']);
                jdbcMetadata.columns(options, function (err, columns) {
                  if (err) {
                    console.log("columns errrorr..");
                  }
                  res.send({
                    result: true,
                    message: "Successfully fetched tables(" + tableName + ") forignKeys & columns!!!",
                    forignKeys: importedKeys,
                    singleTableColumns: columns
                  });
                  console.log("columns fetched...",columns);
                  jdbcMetadata.close(function(err) {
                    if (err){
                      console.log('Error closing connection...');
                      res.send(err);
                    }
                    console.log('Connection closed');
                  });
                });
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
    console.log("connection-> ", connection);
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
