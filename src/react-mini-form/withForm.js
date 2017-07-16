import React from 'react';
import equals from './equals';

export default (getState) => (Component) => {
  return class WithForm extends React.Component {
    static displayName = `WithForm(${ Component.displayName || Component.name || 'Component' })`;

  // TODO(rstankov): Copy static props

    static contextTypes = {
      formStore: () => null,
      formTheme: () => null,
    };

    constructor(props, context) {
      super(props, context);

      this.state = getState(context.formStore, this.props) || {};
      this.unsubscribe = context.formStore.subscribe(() => {
        this.updateState(getState(this.context.formStore, this.props) || {});
      });
    }

    componentWillReceiveProps(nextProps) {
      this.updateState(getState(this.context.formStore, nextProps) || {});
    }

    updateState(newState) {
      if (!equals(this.state, newState)) {
        this.setState(newState);
      }
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    render() {
      return <Component
        {...this.props}
        {...this.state}
        theme={this.context.formTheme} />;
    }
  };
};
