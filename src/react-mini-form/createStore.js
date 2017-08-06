import createValidator from './createValidator';
import createEmitter from './createEmitter';
import createDebouncer from './createDebouncer';

export default function createStore({ values, validations }) {
  const { subscribe, emit } = createEmitter();

  const validate = createValidator(validations);
  const debounce = createDebouncer(1500);

  let state = {
    fields: Object.keys(values).reduce((acc, name) => {
      const value = name in values ? values[name] : '';
      acc[name] = {
        name,
        value,
        defaultValue: value,
        clientError: null,
        serverError: null,
        isValidating: false,
        isFocus: false,
        isChanged: false,
      };
      return acc;
    }, {}),
    status: 'default',
  };

  function getField(name) {
    return (
      state.fields[name] || {
        name,
        value: '',
        clientError: null,
        serverError: null,
      }
    );
  }

  function updateField(field, updates) {
    state.fields = {
      ...state.fields,
      [field.name]: { ...field, ...updates },
    };

    emit();
  }

  function updateFieldByName(name, updates) {
    updateField(getField(name), updates);
  }

  // TODO(rstankov): Handle race-condition
  //  -> change1 -> async1
  //  -> change2 -> async2
  //  -> async2 done
  //  -> async1 done (should be ignored)
  async function validateFieldByName(name) {
    const field = getField(name);
    const error = await validate(name, field.value);

    updateField(field, { clientError: error, isValidating: false });

    return !!error;
  }

  return {
    subscribe,

    getField,

    getStatus() {
      return state.status;
    },

    getValues() {
      return Object.values(state.fields).reduce((acc, { name, value }) => {
        acc[name] = value;
        return acc;
      }, {});
    },

    setStatus(status) {
      state.status = status;

      emit();
    },

    async validateAll() {
      const results = await Promise.all(
        Object.keys(state.fields).map(validateFieldByName),
      );
      return results.filter(Boolean).length === 0;
    },

    handleServerErrors(errors) {
      errors.forEach(({ field, messages }) => {
        updateFieldByName(field, { serverError: messages[0] });
      });
    },

    handleInputBlur(e) {
      const name = e.target.name;

      updateFieldByName(name, { isFocus: false });
      validateFieldByName(name);
    },

    handleInputFocus(e) {
      const name = e.target.name;

      updateFieldByName(name, { isFocus: true });
    },

    handleInputChange(e) {
      const name = e.target.name;
      const value = e.target.value;
      const field = getField(name);

      if (value === field.value) {
        return;
      }

      updateField(field, {
        value,
        isValidating: true,
          isChanged: field.value === field.defaultValue,
      });

      debounce(name, validateFieldByName);
    },
  };
}
