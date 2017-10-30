/*eslint react/prop-types: 0*/
import expect from 'expect'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Enzyme, { shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Broker from '../Broker'

Enzyme.configure({ adapter: new Adapter() })

class Child extends Component {
  static contextTypes = {
    intercomponent: PropTypes.object.isRequired,
  }

  render = () => {
    return <div />
  }
}

describe('InterComponent', () => {
  describe('Client', () => {
    it('should enforce a single child', () => {
      // Ignore propTypes warnings
      const propTypes = Broker.propTypes
      Broker.propTypes = {}

      try {
        expect(() => shallow(
          <Broker>
            <div />
          </Broker>
        )).not.toThrow()

        expect(() => shallow(
          <Broker>
          </Broker>
        )).toThrow(/a single React element child/)

        expect(() => shallow(
          <Broker>
            <div />
            <div />
          </Broker>
        )).toThrow(/a single React element child/)
      } finally {
        Broker.propTypes = propTypes
      }
    })

    it('should add intercomponent information to the child context', () => {
      const spy = jest.spyOn(console, 'error')

      const intercomponent = {
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
      }

      const wrapper = mount(
        <Broker>
          <Child />
        </Broker>
      )

      expect(spy).not.toHaveBeenCalled()

      spy.mockReset()
      spy.mockRestore()

      const child = wrapper.find(Child).instance()
      expect(JSON.stringify(child.context.intercomponent)).toEqual(JSON.stringify(intercomponent))
    })
  })
})
