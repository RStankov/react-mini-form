import React from 'react';

import createStore from '../createStore';
import theme from '../theme';

import Field from './Field';
import SubmitButton from './SubmitButton';

export default class Form extends React.Component {
  // TODO(rstankov): handle when props change
  store = createStore({
    values: this.props.defaultValues || {},
    validations: this.props.validations || {},
  });

  static childContextTypes = {
    formStore: () => null,
    formTheme: () => null,
  };

  getChildContext() {
    return {
      formStore: this.store,
      // TODO(rstankov): Validate theme structure
      formTheme: this.props.theme || theme,
    };
  }

  isUnmounted: boolean = false;

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  render() {
    // TODO(rstankov): pass props
    return (
      <form onSubmit={this.handleSubmit}>
        {this.props.children}
      </form>
    );
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    if (this.store.getStatus() === 'submitting');

    this.store.setStatus('submitting');

    const { node, errors } = await this.props.submit(this.store.getValues());

    // NOTE(rstankov): When form was removed from page before submit is done
    if (this.isUnmounted) {
      return;
    }

    this.store.setStatus('default');

    if (errors && errors.length > 0) {
      this.store.handleServerErrors(errors);
      // TODO(rstankov): handle server errors
      return;
    }

    if (this.props.afterSubmit) {
      this.props.afterSubmit(node);
    }
  };
}

Form.Field = Field;
Form.Submit = SubmitButton;
