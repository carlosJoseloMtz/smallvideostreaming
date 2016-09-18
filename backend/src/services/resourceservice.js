const LOG = require('log4js').getLogger('app');
const config = require('../../config');
const fs = require('fs');
const commons = require('../utils/appcommons');
const fileContainer = config.pathToFiles;

module.exports = {
  uploadFile: function (resource, fileFromClient) {
    let fileUploadPromise = new Promise((resolve, reject) => {
      // if there is a previous resource related
      if (!commons.string.isBlank(resource.path)) {
        console.log('trying to remove a previous resource path');
        fs.unlink(resource.path, (err) => {
          if (err) {
            LOG.error("Could not remove the previous file related to the resource");
            LOG.error(err);
          }
        })
        LOG.info('Removed the previously related resource!');
      }

      resource.path = fileFromClient.path;
      resource.save((err) => {
        if (err) {
          LOG.error("could not update the resource?");
          LOG.error(err);
          reject();
        }
        LOG.info('file uploaded!');
        resolve();
      })

    });
    return fileUploadPromise;
  }
};
