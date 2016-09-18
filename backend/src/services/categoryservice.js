let LOG = require('log4js').getLogger('app');
let Category = require('../models/category');

module.exports = {
  /**
  * Creates -if necessary- new tags/categories.
  */
  upsertElements: function (_tags) {
    if (!_tags || !_tags.length === 0) {
      return;
    }


    // get all the new tags
    _tags.forEach((el) => {
      let _tg = new Category({ tag: el });
      _tg.save((err) => {
        if (err) {
          // TODO: find a better way to insert in case it doesn't exists
          // TODO: such way should perform fast.. Or at least faster than this one!
          if (err.code === 11000) {
            LOG.info("trying to insert an existing tag element");
          } else {
            LOG.error('Error while trying to save the tag ' + el);
            LOG.error(err);
          }
        }
      })
    });
  }
}
