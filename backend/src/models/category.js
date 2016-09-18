var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
* INFO: This model will only be used for autocomplete, this would not be linked by ID
* to any other model.
*/

// define the category schema
var CategorySchema = new Schema({
  tag: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('Category', CategorySchema);
