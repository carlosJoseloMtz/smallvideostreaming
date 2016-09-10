// external dependencies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
// log the endpoints hits
var cors = require('cors');
// overall app's LOG component
var log4js = require('log4js');
var appConfig = require('./config');

// authentication components
var authService = require('./src/services/authservice');

// controller imports!
var usersController = require('./src/routes/userscontroller');
var sessionController = require('./src/routes/sessioncontroller');
var institutionsController = require('./src/routes/institutionscontroller');
var resourcesController = require('./src/routes/resourcescontroller');


// configure the application LOG level
log4js.configure(appConfig.logger);
var LOG = log4js.getLogger('app');

// use the native promise support
mongoose.Promise = global.Promise;

// DB connection
mongoose.connect(appConfig.database, function (err) {
  if (err) {
    LOG.error('Error while connecting to mongodb database, please check the service and connection');
    LOG.error(err);
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

// authentication filters
app.use(authService.auth());
app.use(authService.admin());

// hook here all your controllers directly to the app
app.use(usersController());
app.use(sessionController());
app.use(institutionsController());
app.use(resourcesController());

// server start!
app.listen(appConfig.port);

var startUpMessage = 'Application got up on port ' + appConfig.port + ' at ' + (new Date());
LOG.info(startUpMessage);
// TODO remove this, looks nice only for development :P
console.log(startUpMessage);
