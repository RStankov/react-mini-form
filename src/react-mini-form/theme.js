import React from 'react';

let Select = ({ options, ...props }) => (
  <select {...props}>
    {options.map(({ label, value }, i) => (
      <option key={i} value={value}>{label || value}</option>
    ))}
  </select>
);

let Textarea = ({ ...props }) => (
  <textarea {...props} />
);

let Input = ({ ...props }) => (
  <input {...props} />
);

let RadioGroup = ({ value: fieldValue, options, name, id, ...props }) => (
  <ul>
    {options.map(({ label, value }, i) => (
      <li key={i}>
        <label>
          <input type="radio" name={name} value={value} checked={value === fieldValue} {...props} /> {label || value}
        </label>
      </li>
    ))}
  </ul>
);

export default {
  inputs: {
    textarea: Textarea,
    select: Select,
    text: Input,
    radioGroup: RadioGroup,
  },

  errorMessage({ error }) {
    return error;
  },

  renderInput({ input, ...props }) {
    const Component = typeof input === 'function' ? input : this.inputs[input] || Input;
    const inputProps = Component === Input ? { type: input, ...props } : props;

    return (
      <Component {...inputProps} />
    );
  },

  renderField({ name, label, input, error, isValidating, isFocus, props }) {
    return (
      <div>
        {label && <label htmlFor={name}>{label}: </label>}
        {input}
        {isValidating && <i>validating...</i>}
        {error && <strong>{error}</strong>}
        {isFocus && <i>(focus)</i>}
      </div>
    );
  },

  renderSubmit({ isSubmitting, props: { children, ...otherProps } }) {
    return (
      <input
        {...otherProps}
        type="submit"
        value={isSubmitting ? 'Submitting...' : children}
        disabled={isSubmitting} />
    );
  },

  renderBaseErrors({ errors, props }) {
    // TODO(rstankov): ~
  },

  renderStatusMessage({ status, props }) {
    // TODO(rstankov): ~
  },
};

