var security = {};

/**
* All routes that requires user to be logged in.
*/
security.auth = [
  '/users/:id',
  '/institutes'
];

/**
* All admin routes to be validated.
*/
security.admin = [
  '/institutes'
];

/**
* Contains the token configuration.
*/
security.base = {
  // TODO: create a token that is worth using! xD :V :B
  secureToken: 'VV_thisisthetokenbynowxDpleasedonothackmeth151sjus747357VVV',
  expirationFactor: 'days',
  expirationTime: 14
};

module.exports = security;
