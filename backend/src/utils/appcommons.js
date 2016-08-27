

/**
* Just some common util functions of general usage.
*/
module.exports = {

  /**
  * Specific string namespace.
  */
  string: {
    /**
    * Checks if a string does not contain any character in it.
    * @para str The string to be inspected.
    */
    isBlank: function (str) {
      return !str || /^\s*$/.test(str);
    }
  },

  /**
  * All the application status that may be used through out the application.
  */
  status: {
    NOT_FOUND: 404
  },

  /**
  * Global pagination values.
  */
  pagination: {
    RESULTS_PER_PAGE: 10,
    START_INDEX: 0
  }
};
