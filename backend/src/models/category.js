var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define the category schema
var CategorySchema = new Schema({
  tag: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('Category', CategorySchema);
