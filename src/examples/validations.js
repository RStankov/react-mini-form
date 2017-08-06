export function isRequired(value) {
  if (!value || value.length === 0) {
    return 'is required';
  }
}

export function length({ min, max }) {
  return value => {
    if (min !== undefined && value.length < min) {
      return `should be more than ${min} characters`;
    }

    if (max !== undefined && value.length > max) {
      return `should be less than ${max} characters`;
    }
  };
}

export function isEmail(value) {
  if (value.indexOf('@') === -1) {
    return 'should be valid email address';
  }
}

export function format(regexp, description) {
  return value => {
    if (!value.match(regexp)) {
      return `should match ${description} format.`;
    }
  };
}

export function minValue(min) {
  return value => {
    if (parseFloat(value, 10) < min) {
      return `should be more than ${min}`;
    }
  };
}

