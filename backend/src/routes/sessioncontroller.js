// basic http handler
var express = require('express');
// create the router component to intercept the specified routes
var sessionRouter = express.Router();
// application logger
var LOG = require('log4js').getLogger('app');
var response = require('../dtos/responses');
var User = require('../models/user');
var commons = require('../utils/appcommons');
var SESSION_PATH = '/session';

var sessionController = {
  /**
  * Login for user, creates a session token for the client.
  */
  login: function (req, res) {
    var _email = req.email,
        _pwd = req.password;

    // if some of the parameters are just blank
    if (commons.string.isBlank(_email) || commons.string.isBlank(_pwd)) {
      // just return a simple error
      return res.json(new response.Failed('Invalid email/password'));
    }

    User.
      findOne({email: _email, password: _pwd}).
      exec((err, usr) => {
        if (err) {
          LOG.error('error while trying to login for user ' + _email);
          LOG.error(err);
          return res.json(new response.Failed('Invalid email/password'));
        }
        // TODO: create token for the user
        // TODO: filter the elements of the user that we don't want to send back to the client
        return res.json(new response.Success(usr))
      });
  }
};

/**
* Exposes the routes for this controller.
*/
module.exports = function () {
  sessionRouter.post(SESSION_PATH + "/login", sessionController.login);
  return sessionRouter;
}
