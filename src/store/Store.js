import {createStore} from 'redux'
import rootReducer from '../reducers/RootReducer'

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
};

export default new Store()