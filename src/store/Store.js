import {createStore} from 'redux'
import rootReducer from '../reducers/RootReducer'
import _ from 'lodash';

/**
 * Wrapper class for Redux store, which used to manage application state
 */
const Store = class {
    /**
     * Class constructor
     */
    constructor() {
        // Link to actual Redux store, which manages application state using RootReducer
        this.store = createStore(rootReducer)
    }

    /**
     * Method returns copy of current application state
     */
    getState() {
        return _.cloneDeep(this.store.getState());
    }
};

export default new Store()