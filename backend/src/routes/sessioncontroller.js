// basic http handler
var express = require('express');
// create the router component to intercept the specified routes
var sessionRouter = express.Router();
// application logger
var LOG = require('log4js').getLogger('app');
var response = require('../dtos/responses');
var User = require('../models/user');
var commons = require('../utils/appcommons');
var authService = require('../services/authservice');
var SESSION_PATH = '/session';

var sessionController = {
  /**
  * Login for user, creates a session token for the client.
  */
  login: function (req, res) {
    var _email = req.body.email,
        _pwd = req.body.password;

    // if some of the parameters are just blank
    if (commons.string.isBlank(_email) || commons.string.isBlank(_pwd)) {
      // just return a simple error
      return res.json(new response.Failed('Invalid email/password'));
    }

    User.
      findOne({email: _email}).
      exec((err, usr) => {
        if (err || !usr) {
          LOG.error('error while trying to login for user ' + _email);
          LOG.error(err);
          return res.json(new response.Failed('Invalid email/password'));
        }

        usr.comparePassword(_pwd).
          then(() => {
            // create token for the user
            let _token = authService.createToken(usr);

            // filter the elements of the user that we don't want to send back to the client
            var _res = {
              name: usr.name,
              lastName: usr.lastName,
              userGroup: usr.userGroup,
              entity: usr.entity,
              token: _token
            };

            return res.json(new response.Success(_res));
          }).catch(() => {
            return res.json(new response.Failed('Invalid email/password'));
          });
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
