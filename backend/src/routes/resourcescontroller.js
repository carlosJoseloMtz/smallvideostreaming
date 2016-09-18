let express = require('express');
let LOG = require('log4js').getLogger('app');
let categoryService = require('../services/categoryservice');
let resourceService = require('../services/resourceservice');

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
  uploadResource: function (req, res) {
    let _id = req.params.id;
    let fileFromClient = null;

    let _filter = (element) => {
      return element.fieldname === 'fileFromClient';
    };
    // TODO: validate this is a video file
    if (!req.files || req.files.length == 0 || req.files.filter(_filter).length === 0) {
      return res.json(new response.Failed('No valid file was found'));
    }

    // get the specific file
    fileFromClient = req.files.filter(_filter)[0];

    Resource.findById(_id, (err, rsrc) => {
      if (err || !rsrc) {
        LOG.error('Could not find the given resource');
        LOG.error(err);
        return res.status(404).json(new response.Failed('Sorry, but we could not find any related resource'));
      }

      resourceService.uploadFile(rsrc, fileFromClient)
        .then(() => {
          return res.json(new response.Success('File was successfully uploaded'));
        }).catch(() => {
          return res.json(new response.Failed('Error while trying to update the file'));
        });
    });
  }
};

module.exports = function () {
  let router = express.Router();
  router.post(RESOURCE_PATH, resourcesController.create);
  router.put(RESOURCE_PATH + '/:id/static', resourcesController.uploadResource);
  return router;
}
