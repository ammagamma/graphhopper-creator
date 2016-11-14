module.exports.InvalidSourceFormatException = InvalidSourceFormatException;
module.exports.InvalidGraphException = InvalidGraphException;

function InvalidSourceFormatException(message) {
  this.name = 'InvalidSourceFormatException';
  this.message = message || 'invalid source format';
}

InvalidSourceFormatException.prototype = new Error();

function InvalidGraphException(message) {
  this.name = 'InvalidGraphException';
  this.message = message || 'invalid graph';
}

InvalidGraphException.prototype = new Error();

