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
  },

  /**
  * Lists all the institutes affiliated to the site.
  */
  list: function (req, res) {
    var _page = req.query.page_index;

    // validate the page provided
    try {
      _page = parseInt(_page);
      if (_page < commons.pagination.START_INDEX) {
        throw "Invalid page number";
      }
    } catch (err) {
      LOG.error('Invalid page ' + _page);
      LOG.error(err);
      return res.json(new response.Failed('Invalid page number'));
    }

    var offset = _page === commons.pagination.START_INDEX ?
                              commons.pagination.START_INDEX :
                              (_page * commons.pagination.RESULTS_PER_PAGE);
    Institute.
      find({}).
      skip(offset).
      limit(commons.pagination.RESULTS_PER_PAGE).
      exec((err, results) => {
        if (err) {
          LOG.error('Error while trying to get a set of institutions');
          LOG.error(err);
          return res.json(new response.Failed('Error while trying to get institutes, please try again later'));
        }

        if (!results || results.length === 0) {
          LOG.warn("Did not find results for institutions on page " + _page);
          return res.json(new response.Succes([]))
        }

        return res.json(new response.Success(results));
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
