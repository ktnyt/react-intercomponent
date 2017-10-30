import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Dispatcher extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    init: PropTypes.any.isRequired,
    actions: PropTypes.object.isRequired,
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

  constructor(props, context) {
    super(props, context)
    const { name, init } = props
    const callback = data => this.setState({ data })
    context.intercomponent.subscribe(name, callback)
    this.state = { data: init }
  }

  render = () => {
    const { component, render, children, name } = this.props
    const { data } = this.state

    const actions = {}

    for(const key of Object.keys(this.props.actions)) {
      const action = this.props.actions[key]
      this.context.intercomponent.publish(name, action(data))
    }

    const props = { actions, [name]: data }
    
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
export default Dispatcher