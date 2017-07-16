import createValidator from './createValidator';

function createEmitter() {
  let listeners = [];
  let isEmitting = false;

  return {
    subscribe(listener) {
      if (typeof listener !== 'function') {
        throw new Error('Expected listener to be a function.')
      }

      var isSubscribed = true

      listeners.push(listener)

      return function unsubscribe() {
        if (!isSubscribed) {
          return
        }

        isSubscribed = false

        var index = listeners.indexOf(listener)
        listeners.splice(index, 1)
      }
    },

    emit() {
      if (isEmitting) { return; }

      isEmitting = true;
      for (let i = 0, l=listeners.length; i < l; i++) {
        listeners[i]()
      }
      isEmitting = false;
    }
  };
}

export default function createStore({ values, validations }) {
  const { subscribe, emit } = createEmitter();

  const validate = createValidator(validations);

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

      state.errors = {
        ...state.errors,
        [name]: validate(name, value),
      };

      emit();
    },
  }
}
