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
        isValidating: false,
        isFocus: false,
      };
      return acc;
    }, {}),
    status: 'default',
  };

  function getField(name) {
    return state.fields[name] || { name, value: '', error: null };
  }

  function updateField(field, updates) {
    state.fields = {
      ...state.fields,
      [field.name]: { ...field, ...updates },
    };

    emit();
  }

  // TODO(rstankov): Handle race-condition
  //  -> change1 -> async1
  //  -> change2 -> async2
  //  -> async2 done
  //  -> async1 done (should be ignored)
  async function validateField(name) {
    const field = getField(name);
    const error = await validate(name, field.value);

    updateField(field, { error, isValidating: false });
  }

  return {
    subscribe,

    getField,

    getStatus() {
      return state.status;
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
      const field = getField(name);

      updateField(field, { isFocus: false });

      validateField(name);
    },

    handleInputFocus(e) {
      const name = e.target.name;
      const field = getField(name);

      updateField(field, { isFocus: true });
    },

    handleInputChange(e) {
      const name = e.target.name;
      const value = e.target.value;
      const field = getField(name);

      if (value === field.value) {
        return;
      }

      updateField(field, { value, isValidating: true });

      debounce(name, validateField);
    },
  }
}
