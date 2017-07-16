function combineValidations(rules) {
  if (typeof rules === 'function') {
    rules = [rules];
  }

  return (...args) => rules.map((validate) => validate(...args)).filter(Boolean);
}

function normalizeValidations(validations) {
  return Object.keys(validations || {}).reduce((acc, name) => {
    acc[name] = combineValidations(validations[name]);
    return acc;
  }, {});
}

export default function createValidator(validations) {
  validations = normalizeValidations(validations);

  return (name, value) => {
    if (!validations[name]) {
      return [];
    }

    return validations[name](value) || [];
  }
}
