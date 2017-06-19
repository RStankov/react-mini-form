import React from 'react';

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

function equals(object1, object2) {
  for(let key in object1) {
    if (object1[key] === object2[key]) {
      continue;
    }

    if (!Array.isArray(object1[key]) || !Array.isArray(object2[key])) {
      return false;
    }

    if (object1[key].length !== object2[key].length) {
        return false;
    }

    for(let i = 0, l = object1[key].length; i < l; i++) {
      if (object1[key][i] !== object2[key][i]) {
        return false;
      }
    }
  }

  return true;
}
