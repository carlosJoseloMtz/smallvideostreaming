let express = require('express');
let LOG = require('log4js').getLogger('app');
let categoryService = require('../services/categoryservice');

// required models for this to work
let Resource = require('../models/resource');
let commons = require('../utils/appcommons');
let response = require('../dtos/responses');

// constants
let RESOURCE_PATH = '/resources';

let resourcesController = {

  /**
  * Creates the resource with no file associated.
  */
  create: function (req, res) {
    let _uid = req.body.uid,
        _title = req.body.title,
        _institution = req.body.institution,
        _tags = req.body.tags,
        _authors = req.body.authors,
        _createdBy = req.user.uid;

    let nRsrc = new Resource({
      uid: _uid,
      title: _title,
      institution: _institution,
      tags: _tags,
      authors: _authors,
      createdBy: _createdBy
    });

    nRsrc.save((err, rsrc) => {
      if (err || !rsrc) {
        LOG.error('Error while trying to create a new resource');
        LOG.error(err);
        return res.json(new response.Failed('Could no create the resource, please try later'));
      }
      // insert the elements asynchronously with no catching errors
      categoryService.upsertElements(_tags);

      return res.json(new response.Success(rsrc));
    });
  },

  /**
  * Uploads the static file resource.
  */
  uploadResource: function () {
    // TODO
  }
};

module.exports = function () {
  let router = express.Router();
  router.post(RESOURCE_PATH, resourcesController.create);
  // router.put(RESOURCE_PATH + '/:id/static', resourcesController.uploadResource);
  return router;
}
