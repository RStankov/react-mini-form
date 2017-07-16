import createValidator from './createValidator';
import createEmitter from './createEmitter';

function createDebouncer(wait) {
  let timeouts = {};
  return (name, cb) => {
    clearTimeout(timeouts[name]);
    timeouts[name] = setTimeout(() => {
      Reflect.deleteProperty(timeouts, name);
      cb(name);
    }, wait);
  };
}

export default function createStore({ values, validations }) {
  const { subscribe, emit } = createEmitter();

  const validate = createValidator(validations);
  const debounce = createDebouncer(1500);

  let state = {
    values: values,
    errors: {},
    status: 'default',
  };

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

    handleInputChange(e) {
      const name = e.target.name;
      const value = e.target.value;

      state.values = {
        ...state.values,
        [name]: value
      };

      emit();

      debounce(name, (name) => {
        state.errors = {
          ...state.errors,
          [name]: validate(name, state.values[name]),
        };

        emit();
      });
    },
  }
}
