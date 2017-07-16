import createValidator from './createValidator';
import createEmitter from './createEmitter';
import createDebouncer from './createDebouncer';

export default function createStore({ values, validations }) {
  const { subscribe, emit } = createEmitter();

  const validate = createValidator(validations);
  const debounce = createDebouncer(1500);

  let state = {
    fields: Object.keys(values).reduce((acc, name) => {
      acc[name] = {
        name,
        value: values[name] || '',
        error: null,
      };
      return acc;
    }, {}),
    status: 'default',
  };

  function getField(name) {
    return state.fields[name] || { name, value: '', error: null };
  }

  function updateField(name, newField) {
    state.fields = {
      ...state.fields,
      [name]: newField,
    };

    emit();
  }

  function validateField(name) {
    const field = getField(name);
    const error = validate(name, field.value);

    if (error === field.error) {
      return;
    }

    updateField(name, { ...field, error });
  }

  return {
    subscribe,

    getField,

    getStatus() {
      return state.status;
    },


    getValue(name) {
      return getField(name).value;
    },

    getError(name) {
      return getField(name).error;
    },

    getValues() {
      return Object.value(state.fields).map(({ value }) => value);
    },

    setStatus(status) {
      // TODO(rstankov): Re-validate, handle server side errors
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
      const field = getField(name);

      if (value === field.value) {
        return;
      }

      updateField(name, { ...field, value });

      debounce(name, validateField);
    },
  }
}
