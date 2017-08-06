function combineValidations(rules) {
  if (typeof rules === 'function') {
    rules = [rules];
  }

  return async (...args) => {
    for(let i=0, l=rules.length; i < l; i++) {
      const error = await rules[i](...args);
      if (error) {
        return error;
      }
    }

    return null;
  };
}

function normalizeValidations(validations) {
  return Object.keys(validations || {}).reduce((acc, name) => {
    acc[name] = combineValidations(validations[name]);
    return acc;
  }, {});
}

function noValidations() {
  return null;
}

export default function createValidator(validations) {
  if (!Object.keys(validations).length) {
    return noValidations;
  }

  validations = normalizeValidations(validations);

  return async (name, value) => {
    if (!validations[name]) {
      return null;
    }

    return await validations[name](value);
  }
}
