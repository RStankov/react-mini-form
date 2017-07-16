import withForm from '../withForm';

function Field({ theme, field, name, label, input, ...props }) {
  if (!name) {
    label = name;
  }

  return theme.renderField({
    name,
    label: label,
    error: field.error ? theme.errorMessage({ ...field, label }) : null,
    isValidating: field.isValidating,
    isFocus: field.isFocus,
    props: {},
    input: theme.renderInput({
      input,
      name,
      value: field.value,
      ...props,
    }),
  });
}

export default withForm((form, { name }) => {
  return {
    field: form.getField(name),
    onFocus: form.handleInputFocus,
    onBlur: form.handleInputBlur,
    onChange: form.handleInputChange,
  };
})(Field);
