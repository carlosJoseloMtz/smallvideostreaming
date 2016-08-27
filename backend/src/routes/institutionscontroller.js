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
    let _page = req.query.page_index;

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

    let offset = _page === commons.pagination.START_INDEX ?
                              commons.pagination.START_INDEX :
                              (_page * commons.pagination.RESULTS_PER_PAGE);

    // default result's object
    let resultHolder = {
      totalResults: 0,
      items: []
    };
    Institute.find({}).
      count((err, count) => {
        if (err) {
          LOG.error("Error while counting the total of institutes registered to the site");
          LOG.error(err);
          return res.json(new response.Failed('Error while trying to get institutes, please try again later'));
        }

        // check the count, and if this is just 0, don't even bother to hit the database again
        if (count === 0) {
          LOG.warn("Did not find results for institutions on page " + _page);
          return res.json(new response.Success(resultHolder));
        }
        resultHolder.totalResults = count;

        // actually run the query with filters
        Institute.find({}).
          skip(offset).
          limit(commons.pagination.RESULTS_PER_PAGE).
          exec((err, results) => {
            if (err) {
              LOG.error('Error while trying to get a set of institutions');
              LOG.error(err);
              return res.json(new response.Failed('Error while trying to get institutes, please try again later'));
            }

            // if for some reason we still get requests after the pagination finished
            if (!results || results.length === 0) {
              // log it so that we can analyze it later
              LOG.warn("Did not find results for institutions on page " + _page);
              return res.json(new response.Success(resultHolder))
            }
            resultHolder.items = results;
            resultHolder.count = results.length;
            return res.json(new response.Success(resultHolder));
          });
      });
  },

  /**
  * Gets the information for a specific institute.
  */
  getInfo: function (req, res) {
    let _id = req.params.id;

    // check if the user info is not valid (for some reason)
    if (commons.string.isBlank(_id)) {
      return res.status(commons.status.NOT_FOUND).json(new response.Failed('Could not find the institution you are looking for'));
    }

    Institute.findById(_id, (err, inst) => {
      if (err) {
        LOG.error("Error while trying to get institute " + _id);
        LOG.error(err);
        return res.json(new response.Failed('Error while trying to find the institute, please try again later'));
      }

      if (!inst) {
        return res.status(commons.status.NOT_FOUND).json(new response.Failed('Could not find the institution you are looking for'));
      }

      return res.json(new response.Success(inst));
    });

  }
};


/**
* Expose all the request mappings with their corresponding handlers.
*/
module.exports = function () {
  router.post(INSTITUTE_PATH, institutionController.create);
  router.get('/participants/institutes', institutionController.list);
  router.get('/participants/institutes/:id', institutionController.getInfo);
  return router;
};
