import React from 'react';

import { Form, Field, SubmitButton } from 'react-mini-form';
import theme from 'react-mini-form/theme';

const LENGTH_OPTIONS = [
  {value: 15, label: '15 minutes'},
  {value: 30, label: '30 minutes'},
  {value: 45, label: '45 minutes'},
];

const VIA_OPTIONS = [
  {value:'email', label: 'Email'},
  {value:'push', label: 'Push notification'},
  {value:'phone', label: 'Phone'},
];

const FIELDS = {
  speakerName: 'Radoslav',
  speakerEmail: '',
  talkTitle: '',
  talkDescription: '',
  talkLength: '15',
  level: 0,
};

function RatingInput({ name, value, min, max, onChange }) {
  const minus = (e) => { e.preventDefault(); value === min || onChange({ target: { name, value: value - 1 }}) };
  const plus = (e) => { e.preventDefault(); value === max || onChange({ target: { name, value: value + 1 }}) };

  return (
    <div>
      <button onClick={minus}>-</button> {value} <button onClick={plus}>+</button>
    </div>
  );
}

class RenderWithCount extends React.Component {
  count = 0;
  color = ['red', 'blue', 'green', 'purple'][Math.floor(Math.random() * 4) ]

  render() {
    this.count += 1;

    const border = `1px dashed ${ this.color }`;

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
        <div style={countStyle}>{this.count}</div>
        {this.props.children}
      </div>
    );
  }
}

const customTheme = {
  ...theme,
  renderField(...args) {
    return (
      <RenderWithCount>
        {theme.renderField(...args)}
      </RenderWithCount>
    );
  },
  renderSubmit(...args) {
    return (
      <RenderWithCount>
        {theme.renderSubmit(...args)}
      </RenderWithCount>
    );
  },
}

function isRequired(value) {
  if (!value || value.length === 0) {
    return 'is required';
  }
}

function length({ min, max }) {
  return (value) => {
    if (min !== undefined && value.length < min) {
      return `should be more than ${ min } characters`;
    }

    if (max !== undefined && value.length > max) {
      return `should be less than ${ max } characters`;
    }
  };
}

function isEmail(value) {
  if (value.indexOf('@') === -1) {
    return 'should be valid email address';
  }
}

const validations = {
  speakerName: [isRequired],
  speakerEmail: [isRequired, isEmail, length({ min: 5, max: 20 })],
};

let SubmissionForm = () => (
  <Form defaultValues={FIELDS} validations={validations} submit={remoteCall} theme={customTheme}>
    <h2>Speaker</h2>
    <Field name="speakerName" label="Name" />
    <Field name="speakerEmail" label="Email" input="email" />
    <h2>Talk</h2>
    <Field name="talkTitle" label="Title" />
    <Field name="talkDescription" label="Description" input="textarea" />
    <Field name="talkLength" label="Length" input="select" options={LENGTH_OPTIONS} />
    <Field name="notifyVia" label="Notify me via" input="radioGroup" options={VIA_OPTIONS} />
    <Field name="level" label="Level" input={RatingInput} min={0} max={5} />
    <SubmitButton>Submit</SubmitButton>
  </Form>
);

async function remoteCall(values) {
  console.log(values);

  if (!values.speakerName) {
    return { errors: { speakerName: ['required'] } };
  }

  // do ajax and redirect
  return { result: 'success' };
}

export default SubmissionForm;
