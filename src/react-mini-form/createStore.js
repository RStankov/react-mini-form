import createValidator from './createValidator';
import createEmitter from './createEmitter';
import createDebouncer from './createDebouncer';
import equals from './equals';

export default function createStore({ values, validations }) {
  const { subscribe, emit } = createEmitter();

  const validate = createValidator(validations);
  const debounce = createDebouncer(1500);

  let state = {
    values: values,
    errors: {},
    status: 'default',
  };

  function validateField(name) {
    const error = validate(name, state.values[name]);

    if (equals(error, state.errors[name] || [])) {
      return;
    }

    state.errors = {
      ...state.errors,
      [name]: validate(name, state.values[name]),
    };

    emit();
  }

  return {
    subscribe,

    getStatus() {
      return state.status;
    },

    getValue(name) {
      return state.values[name];
    },

    getErrors(name) {
      return state.errors[name] || [];
    },

    getValues() {
      return state.values;
    },

    setStatus(status) {
      state.errors = {}; // TODO(rstankov): Maybe we shouldn't always hide errors
      state.status = status;

      emit();
    },

    handleInputBlur(e) {
      const name = e.target.name;

      validateField(name);
    },

    handleInputChange(e) {
      const name = e.target.name;
      const value = e.target.value;

      if (value === state.values[name]) {
        return;
      }

      state.values = {
        ...state.values,
        [name]: value
      };

      emit();

      debounce(name, validateField);
    },
  }
}
