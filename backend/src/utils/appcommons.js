

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
  }
};
