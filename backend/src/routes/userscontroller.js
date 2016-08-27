// basic http handler
var express = require('express');
// create the router component to intercept the specified routes
var router = express.Router();
// application logger
var LOG = require('log4js').getLogger('app');
var response = require('../dtos/responses');
var commons = require('../utils/appcommons');
var User = require('../models/user');

// constants
var USERS_PATH = '/users';
var DEFAULT_REGISTRY_GROUP = 'student';

var userController = {

  /**
  * Registers a new user to the site with basic privileges (student).
  */
  create: function (req, res) {
    var pass = req.body.password,
        rPass = req.body.repeatedPassword;

    if (pass !== rPass) {
      return res.json(new response.Failed('Passwords do not match'));
    }

    var _newUser = new User({
      email: req.body.email,
      name: req.body.name,
      lastName: req.body.lastName,
      password: req.body.password,
      userGroup: DEFAULT_REGISTRY_GROUP,
      entity: null
    });

    _newUser.save(function (err, usr) {
      if (err) {
        // if this is a douplicate error!
        if (err.code === 11000) {
          LOG.warn('User is trying to register an existing account');
          return res.json(new response.Failed('This email account is already registered, please use the recover password mechanism'));
        }
        LOG.error('Could not save new user');
        LOG.error(err);
        return res.json(new response.Failed('Could not register the user, please check the information'));
      }

      return res.json(new response.Success('Thanks for registering to this site, a confirmation email will be sent to your email, please check it out to use your account'));
    });
  },

  /**
  * Grants privileges for users based on the following:
  *   - No user will be granted admin permissions.
  *   - Only following string literals are allowed for groupType: 'student', 'author'.
  *   - Only for admin users
  */
  grantPrivileges: function (req, res) {
    var _id = req.body.user,
        _userGroup = req.body.userGroup;

    // invalid data
    if (commons.string.isBlank(_id) || commons.string.isBlank(_userGroup)) {
      return res.json(new response.Failed("Please make sure the data is correct"));
    }
    // invalid user groups assignment
    if (_userGroup !== 'author' && _userGroup !== 'student') {
      return res.json(new response.Failed('Invalid group for user'));
    }

    // update the user
    User.update({ _id: _id }, { $set: { userGroup: _userGroup}}, (err, status) => {
      if (err) {
        LOG.error('Error while granting privileges');
        LOG.error(err);
        return res.json(new response.Failed('Error while trying to update user privileges, please try later'));
      }

      // did not update any records, could also be that the value to be set already was setup
      if (status.nModified === 0) {
        return res.json(new response.Failed('Did not find any matching user to be updated'));
      }

      return res.json(new response.Success('Successfully upudated user'));
    });
  }
};


/**
* Expose all the request mappings with their corresponding handlers.
*/
module.exports = function () {
  router.post(USERS_PATH, userController.create);
  router.put(USERS_PATH + "/privileges", userController.grantPrivileges)
  return router;
};
