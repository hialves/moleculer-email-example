const { MoleculerError } = require('moleculer').Errors;

module.exports = {
  createUserError: (message, code, type) => {
    return new MoleculerError(message, code, type)
  }
}