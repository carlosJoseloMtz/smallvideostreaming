var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var LOG = require('log4js').getLogger('app');

// define the institution schema
var InstitutionSchema = new Schema({
  /**
  * The legal "unique code" given by the goverment to
  * the institution (for cultural reference look for "Mexico RFC").
  */
  rfc: {
    type: String,
    required: true,
    unique: true
  },
  /**
  * This is just a contact email.
  */
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  /**
  * When the institution was created.
  */
  inscriptionDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  /**
  * Which user registered the institution (the one in the session when creating the element).
  */
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Institution', InstitutionSchema);
