import React, {Component} from 'react';
import {App} from './src/containers/App'
import Store from './src/store/Store'
import {Provider} from 'react-redux'

export default class extends Component {
  render() {
    return (
        <Provider store={Store.store}>
            <App/>
        </Provider>
    );
  }
}