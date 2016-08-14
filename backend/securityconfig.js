var security = {};

/**
* All routes that requires user to be logged in.
*/
security.auth = [
  '/users/:id'
];

/**
* All admin routes to be validated.
*/
security.admin = [
];

/**
* Contains the token configuration.
*/
security.base = {
  // TODO: create a token that is worth using! xD :V :B
  secureToken: 'thisisthetokenbynowxD',
  expirationFactor: 'days',
  expirationTime: 14
};

module.exports = security;
