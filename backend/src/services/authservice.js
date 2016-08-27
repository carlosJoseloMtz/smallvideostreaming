// global imports
var express = require('express');
var jwt = require('jwt-simple');
var moment = require('moment');
var LOG = require('log4js').getLogger('app');


// custom imports
var securityConfig = require('../../securityconfig');

module.exports = {

  /**
  * Creates a token based on the user's information.
  * @param user The user with the information to encode it into the token.
  */
  createToken: function (user) {
    var _usr = {
      uid: user.id,
      email: user.email,
      group: (!user.userGroup ? '' : user.userGroup),
    };

    var payload = {
      sub: _usr,
      iat: moment().unix(),
      exp: moment().add(
        securityConfig.base.expirationTime,
        securityConfig.base.expirationFactor).unix()
    };

    return jwt.encode(payload, securityConfig.base.secureToken);
  },

  /**
  * Filter to make sure that the client is sending a valid token to access the application.
  */
  auth: function () {
    var router = express.Router();
    if (!securityConfig.auth || securityConfig.auth.length === 0) {
      return router;
    }

    router.all(securityConfig.auth, function (req, res, next) {
      if (!req.headers.authorization) {
        LOG.warn('A user is trying to access a resource without credentials')
        LOG.warn(req.headers);
        LOG.warn(req.body);
        return res.status(401).json({message: 'please login'});
      }

      var token = req.headers.authorization;

      var payload = null;
      try {
        payload = jwt.decode(token, securityConfig.base.secureToken);
      } catch (err) {
        LOG.error('Someone is trying to use an invalid token! ' + token);
        LOG.error(err);
        return res.status(401).json({message: 'Invalid token'});
      }

      if (payload.exp <= moment().unix()) {
        LOG.warn("Expired token " + token);
        return res.status(403).json({message: 'Token already expired'});
      }

      req.user = payload.sub;
      next();
    });

    return router;
  },

  /**
  * Filter to make sure that the client is an admin - it requires the user to be logged in.
  */
  admin: function () {
    var router = express.Router();
    if (!securityConfig.admin || securityConfig.admin.length === 0) {
      return router;
    }

    router.all(securityConfig.admin, function (req, res, next) {
      if (!req.user) {
        LOG.fatal('Someone with no credentials is trying to access an admin resource!');
        return res.status(401).json({message: 'Please try to login at least..'});
      }

      if (req.user.group !== 'admin') {
        LOG.fatal('A known user with low privileges is trying to acces directly to a admin resource ' + req.user.email);
        return res.status(403).json({message: 'Sorry but you have not enough privileges :)'});
      }

      next();
    });

    return router;
  }
};
