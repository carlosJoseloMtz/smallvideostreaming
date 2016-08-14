

var transactionResponses = {

  /**
  * Creates a JSON response with the data indicating the transaction failed,
  * contains a default message 'could not complete the request properly' in case parameter is not present.
  * @param message Error message to be used on the response.
  */
  Failed: function (message) {
    return {status: 'error', errorMessage: (message ? message : 'Could not complete the request properly')};
  },

  /**
  * Creates a JSON response with the data indicating the transaction was properly completed.
  * @param _data Data to be included on the return.
  */
  Success: function (_data) {
    return {status: 'ok', data: _data};
  }
};

module.exports = transactionResponses;
