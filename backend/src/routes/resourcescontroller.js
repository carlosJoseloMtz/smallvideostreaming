let express = require('express');
let LOG = require('log4js').getLogger('app');

// required models for this to work
let Resource = require('../models/resource');
let Category = require('../models/category');
let commons = require('../utils/appcommons');
var response = require('../dtos/responses');

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
      if (err) {
        LOG.error('Error while trying to create a new resource');
        LOG.error(err);
        return res.json(new response.Failed('Could no create the resource, please try later')):
      }

      let nTags = [];

      // get all the new tags
      _tags.forEach((el) => {
        let _tg = new Category({ tag: el });
        nTags.push(_tg);
      });

      // update the tag files
      Category.update(
        { tag: { '$in': nTags } },
        { '$upsert': true },
        (err) => {
          if (err) {
            LOG.error('Error while trying to insert the tags of the just created resource ' + rsrc.id);
            // nothing else to do
          }
        }
      )
    })
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
