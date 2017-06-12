import React from 'react';

import createStore from '../createStore';
import theme from '../theme';

export default class Form extends React.Component {
  store = createStore(this.props.defaultValues);

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

    if (this.store.status() === 'submitting');

    this.store.setStatus('submitting');

    this.props.submit(this.store.getValues());

    /*
    TODO

    if (this.state.isSubmitting) {
      return;
    }

    this.setState({ isSubmitting: true, errors: {} });

    const { errors } = await this.props.onSubmit(this.state.fields);
    */
  };
}
