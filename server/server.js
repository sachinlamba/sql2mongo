var express = require('express');
var router = require('./routes/routes.js')
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
// mongoose.connect('mongodb://sachin:lamba@ds253587.mlab.com:53587/ppsample');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../client'));
app.use(express.static(path.join(__dirname, '../client')));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));

app.use('/', router);

module.exports=app;

//mongo ds253587.mlab.com:53587/ppsample -u sachin -p lamba
