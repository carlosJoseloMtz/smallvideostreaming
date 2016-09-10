var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define the resource schema
var ResourceSchema = new Schema({
  uid: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  // the institution which owns this resource
  institution: {
    type: Schema.Types.ObjectId,
    ref: 'Institution',
    required: true
  },
  tags: [{ type: String }],

  // the people involved on this resource
  authors: [ { type: Schema.Types.ObjectId, ref: 'User' } ],

  /**
  * Meta information for admin purposes.
  */

  // who created this resource
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // When this was created
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

module.exports = mongoose.model('Resource', ResourceSchema);
