
// external dependencies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
// log the endpoints hits
var cors = require('cors');
// overall app's logger component
var log4js = require('log4js');
var appConfig = require('./config');


// configure the application logger level
log4js.configure(appConfig.logger);
var logger = log4js.getLogger('app');

// use the native promise support
mongoose.Promise = global.Promise;

// DB connection
mongoose.connect(appConfig.database, function (err) {
  if (err) {
    logger.error('Error while connecting to mongodb database, please check the service and connection');
    logger.error(err);
  }
});


// express
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
// get the body as json
app.use(bodyParser.json());
// log the url hits
app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));
// cross site scripting
app.use(cors());

// server start!
app.listen(appConfig.port);

logger.info('Application got up on port ' + appConfig.port + ' at ' + (new Date()));