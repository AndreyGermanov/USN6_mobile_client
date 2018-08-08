import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './containers/App';
import registerServiceWorker from './registerServiceWorker';
import Store from "./store/Store";
import {Provider} from 'react-redux'

ReactDOM.render(
    <Provider store={Store.store}>
        <App />
    </Provider>, document.getElementById('root'));
registerServiceWorker();
