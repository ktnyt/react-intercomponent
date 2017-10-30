import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Broker extends Component {
  subscribers = {}

  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  static contextTypes = {
    intercomponent: PropTypes.object,
  }

  static childContextTypes = {
    intercomponent: PropTypes.object.isRequired,
  }

  getChildContext = () => {
    return {
      ...this.context,
      intercomponent: {
        publish: (name, data) => {
          if(name in this.subscribers) {
            this.subscribers[name].forEach(subscriber => subscriber(data))
          }
        },
        subscribe: (name, callback) => {
          if(!(name in this.subscribers)) {
            this.subscribers[name] = []
          }
          this.subscribers[name].push(callback)
        },
      },
    }
  }

  render = () => {
    return React.Children.only(this.props.children)
  }
}

export default Broker