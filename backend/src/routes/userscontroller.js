// basic http handler
var express = require('express');
// create the router component to intercept the specified routes
var router = express.Router();
// application logger
var LOG = require('log4js').getLogger('app');

var USERS_PATH = '/users';

var routerController = {

  /**
  * Creates a new user.
  */
  create: function (req, res) {
    LOG.info('trying to create a user');
    LOG.info(req.body);
    console.log(req.body);
    res.json({some: 'message'});
  },
};

module.exports = function () {
  router.post(USERS_PATH, routerController.create);

  return router;
};
