import withForm from '../withForm';

function Field({ theme, value, error, name, label, input, ...props }) {
  return theme.renderField({
    name,
    label: label || name,
    error: error ? theme.errorMessage({ name, label: label || name, value, error }) : null,
    props: {},
    input: theme.renderInput({
      input,
      name,
      value,
      ...props,
    }),
  });
}

export default withForm((form, { name }) => {
  return {
    value: form.getValue(name),
    error: form.getError(name),
    onBlur: form.handleInputBlur,
    onChange: form.handleInputChange,
  };
})(Field);
