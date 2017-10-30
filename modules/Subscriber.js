import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Subscriber extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    init: PropTypes.any,
    component: PropTypes.func,
    render: PropTypes.func,
    children: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node,
    ]),
  }

  static defaultProps = {
    init: undefined,
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

  constructor(props, context) {
    super(props, context)
    const { name, init } = props
    const callback = data => this.setState({ data })
    context.intercomponent.subscribe(name, callback)
    this.state = { data: init }
  }

  render = () => {
    const { name, component, render, children } = this.props
    const { data } = this.state
    const props = { [name]: data }

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

export default Subscriber

