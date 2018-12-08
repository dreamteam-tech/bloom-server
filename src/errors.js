const { UserInputError } = require('apollo-server');

const transMock = (id) => id;

function formatJoiError(error, t = transMock) {
  let errors = {};

  if (error && error.details) {
    for (let i = 0; i < error.details.length; i++) {
      const err = error.details[i];
      const path = err.path.join('.').replace(/"/g, '');

      if (typeof errors[path] === 'undefined') {
        errors[path] = [];
      }

      const message = err.message.replace(path, t(err.context.label)).replace(/"/g, '');

      errors[path].push(message);
    }
  }

  return errors;
}

class JoiError extends UserInputError {
  constructor(e) {
    super('Validation error', {
      errors: e instanceof Error ? formatJoiError(e) : e
    });
  }
}

module.exports = {
  JoiError,
  formatJoiError
};
