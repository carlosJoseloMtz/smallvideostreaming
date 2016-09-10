let LOG = require('log4js').getLogger('app');
let localConfig = require('../../local');
let commons = require('../utils/appcommons');
let fileContainer = localConfig.pathToFiles;

module.exports = {
  uploadFile: function (resource) {
    let fileUploadPromise = new Promise((resolve, reject) => {
      LOG.info('resource');
      LOG.info(resource);
      // if there is a previous resource related
      if (!commons.string.isBlank(resource.path)) {
        // TODO: remove the  previous file!
        LOG.info('Removed the previously related resource!');
        // TODO: catch any error to call reject method
      }
      LOG.info('file uploaded!');
      resolve();
    });
    return fileUploadPromise;
  }
};
