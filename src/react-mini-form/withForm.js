import React from 'react';

export default (getState) => (Component) => {
  return class WithForm extends React.Component {
    static displayName = `WithForm(${ Component.displayName || Component.name || 'Component' })`;

    static contextTypes = {
      formStore: () => null,
      formTheme: () => null,
    };

    constructor(props, context) {
      super(props, context);

      this.state = getState(context.formStore, this.props) || {};
      this.unsubscribe = context.formStore.subscribe(() => {
        this.setState(getState(this.context.formStore, this.props) || {});
      });
    }

    componentWillReceiveProps(nextProps) {
      this.setState(getState(this.context.formStore, nextProps) || {});
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

  // TODO(rstankov): Copy static props
};
