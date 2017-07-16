import withForm from '../withForm';

function Field({ theme, onChange, value, errors, name, input, label, ...props }) {
  const error = errors.length > 0 ? theme.errorMessage({ name, label: label || name, value, error: errors[0] }) : null;

  return theme.renderField({
    name,
    label: label || name,
    error,
    props: {},
    input: theme.renderInput({
      input,
      ...props,
      name,
      value,
      onChange,
    }),
  });
}

export default withForm((form, { name }) => {
  return {
    value: form.getValue(name),
    errors: form.getErrors(name),
    onBlur: form.handleInputBlur,
    onChange: form.handleInputChange,
  };
})(Field);
