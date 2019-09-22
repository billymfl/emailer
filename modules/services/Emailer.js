/**
 * A class to represent the interface of a Emailer class
 * @class
 *
 */

/**
  * Emailer interface
  */
class Emailer {
  /**
       * @constructor
       */
  constructor() {
    if (this.constructor === Emailer) {
      throw new TypeError('Abstract interface Emailer cannot be instantiated.');
    }

    if (!this.getName) {
      throw new Error('must implement getName method');
    }

    if (!this.buildRequest) {
      throw new Error('must implement buildRequest method');
    }

    if (!this.isSuccess) {
      throw new Error('must implement isSuccess method');
    }
  }

  /*
    - returns the name of the service
    getName() string

    - builds the request object to be used to call the service
    buildRequest(data object) object

    - checks that the response is successful by comparing to the response we expect from the service
    isSuccess(response object) boolean
  */
}

module.exports = Emailer;
