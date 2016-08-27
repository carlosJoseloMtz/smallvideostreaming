// basic http handler
var express = require('express');
// create the router component to intercept the specified routes
var router = express.Router();
// application logger
var LOG = require('log4js').getLogger('app');
var response = require('../dtos/responses');
var Institute = require('../models/institution');
var commons = require('../utils/appcommons');
// constants
var INSTITUTE_PATH = '/institutes';

var institutionController = {

  /**
  * Registers a new user to the site with basic privileges (student).
  */
  create: function (req, res) {
    var _rfc = req.body.rfc,
        _email = req.body.email,
        _name = req.body.name,
        // get the user's id from the req.user.id (the one decoded by the token)
        _createdBy = req.user.uid;
    if (commons.string.isBlank(_rfc) ||
          commons.string.isBlank(_email) ||
          commons.string.isBlank(_name)) {
      return res.json(new response.Failed('Invalid request, make sure the information is properly filled'));
    }

    let _nIns = new Institute({
      rfc: _rfc,
      email: _email,
      name: _name,
      createdBy: _createdBy
    });

    _nIns.save((err, inst) => {
      if (err) {
        LOG.error('Could not create a new institution!');
        LOG.error(err);
        return res.json(new response.Failed('Error while trying to crete the institution, please try later'));
      }

      // return just the id
      return res.json(new response.Success(inst.id));
    });
  }
};


/**
* Expose all the request mappings with their corresponding handlers.
*/
module.exports = function () {
  router.post(INSTITUTE_PATH, institutionController.create);
  return router;
};
