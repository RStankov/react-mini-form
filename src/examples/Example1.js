import React from 'react';

import { Form, createTheme, defaultTheme, withForm } from 'react-mini-form';
import { isRequired, length, isEmail, format, minValue } from './validations';

const LENGTH_OPTIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
];

const VIA_OPTIONS = [
  { value: 'email', label: 'Email' },
  { value: 'push', label: 'Push notification' },
  { value: 'phone', label: 'Phone' },
];

function NumberInput({ name, value, min, max, onChange }) {
  value = parseInt(value, 10);

  const minus = e => {
    e.preventDefault();
    value === min || onChange({ target: { name, value: value - 1 } });
  };
  const plus = e => {
    e.preventDefault();
    value === max || onChange({ target: { name, value: value + 1 } });
  };

  return (
    <div>
      <button onClick={minus}>-</button>&nbsp;{value}&nbsp;
      <button onClick={plus}>+</button>
    </div>
  );
}

const ShowAmount = withForm((form) => {
  return {
    amount: form.getField('speakerHourlyRate').value * (form.getField('talkLength').value/60),
  };
})(({ amount }) => <strong>${amount}</strong>);

class RenderWithCount extends React.Component {
  count = 0;
  color = ['red', 'blue', 'green', 'purple'][Math.floor(Math.random() * 4)];

  render() {
    this.count += 1;

    const border = `1px dashed ${this.color}`;

    const divStyle = {
      position: 'relative',
      border,
    };

    const countStyle = {
      position: 'absolute',
      top: 0,
      right: 0,
      padding: '2px 5px',
      fontSize: 11,
    };

    return (
      <div style={divStyle}>
        <div style={countStyle}>
          {this.count}
        </div>
        {this.props.children}
      </div>
    );
  }
}

const customTheme = createTheme({
  renderField(...args) {
    return (
      <RenderWithCount>
        {defaultTheme.renderField(...args)}
      </RenderWithCount>
    );
  },
  renderSubmit(...args) {
    return (
      <RenderWithCount>
        {defaultTheme.renderSubmit(...args)}
      </RenderWithCount>
    );
  },

  // TODO(rstankov): Try having
  // - normalize server errors
  // - normalize submit result
});


const FIELDS = {
  speakerName: 'Radoslav',
  speakerEmail: '',
  speakerHourlyRate: 0,
  talkTitle: '',
  talkDescription: '',
  talkLength: '15',
};

const VALIDATIONS = {
  speakerName: [isRequired],
  speakerEmail: [isRequired, isEmail, length({ min: 5, max: 20 })],
  talkTitle: [isRequired],
  talkDescription: [isRequired],
  speakerHourlyRate: [minValue(0)],
  talkStartsAt: [format(/[0-2]\d:[0-5]\d/, '[hour]:[minute]')],
};

let SubmissionForm = () =>
  <Form
    defaultValues={FIELDS}
    validations={VALIDATIONS}
    submit={remoteCall}
    afterSubmit={afterSubmit}
    theme={customTheme}>
    <h2>Speaker</h2>
    <Form.Field name="speakerName" label="Name" />
    <Form.Field name="speakerEmail" label="Email" input="email" />
    <Form.Field
      name="speakerHourlyRate"
      label="Hourly rate"
      input={NumberInput}
      min={0}
      max={5}
    />
    <h2>Talk</h2>
    <Form.Field name="talkTitle" label="Title" />
    <Form.Field name="talkDescription" label="Description" input="textarea" />
    <Form.Field
      name="talkLength"
      label="Length"
      input="select"
      options={LENGTH_OPTIONS}
    />
    <Form.Field
      name="notifyVia"
      label="Notify me via"
      input="radioGroup"
      options={VIA_OPTIONS}
    />
    <Form.Field name="talkStartsAt" label="Starts at" placeholder="00:00" />
    <p>
      Amount: <ShowAmount />
    </p>
    <Form.Submit>Submit</Form.Submit>
  </Form>;

async function remoteCall(values) {
  console.log('submit', values);

  if (values.speakerEmail === 'foo@bar') {
    return { errors: [{ field: 'speakerEmail', messages: ['already registered'] }]};
  }

  return { node: 'success' };
}

function afterSubmit(...args) {
  console.log('afterSubmit', ...args);
}

export default SubmissionForm;
