import withForm from '../withForm';

function Field({ theme, onChange, value, errors, name, input, label, ...props }) {
  return theme.renderField({
    name,
    label,
    errors,
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
