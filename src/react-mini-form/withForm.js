import React from 'react';

export default (setState) => (Component) => {
  return class WithForm extends React.Component {
    static displayName = `WithForm(${ Component.displayName || Component.name || 'Component' })`;

    static contextTypes = {
      formStore: () => null,
      formTheme: () => null,
    };

    constructor(props, context) {
      super(props, context);

      this.state = setState(context.formStore, this.props) || {};
      this.unsubscribe = context.formStore.subscribe(() => {
        this.setState(setState(this.context.formStore, this.props) || {});
      });
    }

    componentWillReceiveProps(nextProps) {
      this.setState(setState(this.context.formStore, nextProps) || {});
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
