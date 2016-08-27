var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
var LOG = require('log4js').getLogger('app');

// define the user schema
var UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  userGroup: {
    type: String,
    required: true,
    enum: ['admin', 'author', 'student']
  },
  // this indicates the institution an author is related to -just in case-
  entity: {
    type: String,
    required: false
  }
});


/**
* Encrypts the password when saving to the database.
*/
UserSchema.pre('save', function (next) {
  var user = this;
  if (this.isModified('password') || this.isNew) {
    LOG.debug('trying to encrypt a password');
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        LOG.error('Could not SALT password for user ' + user.email);
        return next(err);
      }
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          LOG.error('Could not HASH the password for user ' + user.email);
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

/**
* Compares a password with an existing one on the database for a specific user.
*/
UserSchema.methods.comparePassword = function (passw) {
  var selfPromise = new Promise((resolve, reject) => {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
      if (err || !isMatch) {
        reject();
      } else {
        resolve();
      }
    });
  });

  return selfPromise;
};

module.exports = mongoose.model('User', UserSchema);
