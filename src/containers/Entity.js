import Store from '../store/Store';
import NavigationService from '../utils/NavigationService'

/**
 * Controller class for Entity base component. Contains all methods and properties, which used by any model
 * management module
 */
class EntityContainer {

    /**
     * Class constructor
     */
    constructor() {
    }

    /**
     * Method defines set of properties, which are available inside controlled component inside "this.props"
     * @param state: Link to application state
     * @returns Array of properties
     */
    mapStateToProps(state) {
        return {
            isLogin: state.isLogin,
            isUpdating: state.isUpdating,
            errors: state.errors
        }
    }

    /**
     * Function defines methods which will be available inside component, which this controller manages
     * @param dispatch - Store dispatch functions, allows to transfer actions to Redux store
     * @returns object of methods, which are available in component
     */
    mapDispatchToProps(dispatch) {
        return {}
    }

    /**
     * Method returns array of properties, the same array that available in this component
     * @returns Array of properties
     */
    getProps() {
        const state = Store.getState();
        return this.mapStateToProps(state);
    }

    /************************************************************
     * Generic functions used to clean values of various types, *
     * before pushing to database                               *
     ************************************************************/

    cleanStringField(value) {
        return value.toString().trim()
    }

    cleanIntField(value) {
        const result = parseInt(value);
        if (!isNaN(result) && value == result) return result;
        return null;
    }

    cleanDecimalField(value) {
        const result = parseFloat(value);
        if (!isNaN(result) && value == result) return result;
        return null;
    }

    cleanEmailField(value) {
        value = value.toString().trim().toLowerCase();
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(value)) return null;
        return value;
    }
}

export default EntityContainer;