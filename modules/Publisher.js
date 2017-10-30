import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Publisher extends Component {
  static propTypes = {
    name: PropTypes.string,
    component: PropTypes.func,
    render: PropTypes.func,
    children: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node,
    ]),
  }

  static contextTypes = {
    intercomponent: PropTypes.shape({
      publish: PropTypes.func.isRequired,
      subscribe: PropTypes.func.isRequired,
    }),
  }

  static childContextTypes = {
    intercomponent: PropTypes.object.isRequired,
  }

  getChildContext = () => {
    return this.context
  }

  render = () => {
    const { component, render, children } = this.props
    const publish = (name, data) => this.context.intercomponent.publish(name, data)
    const props = { publish }

    return (
      component ? (
        React.createElement(component, props)
      ) : render ? (
        render(props)
      ) : children ? (
        typeof children === 'function' ? (
          children(props)
        ) : !Array.isArray(children) || children.length ? (
          React.cloneElement(React.Children.only(children), props)
        ) : null
      ) : null
    )
  }
}

export default Publisher