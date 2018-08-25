import {connect} from "react-redux";
import AppComponent from '../components/App';
import NavigationService from "../utils/NavigationService";
import Store from '../store/Store'

/**
 * Controller class for main "App" component. Provides properties and event handlers for this component
 */
class AppContainer {

    /**
     * Method returns list of properties, which are available inside component
     * @param state: Link to applicaiton state
     * @param ownProps: Parameters, passed from top component or as a property of JSX tag
     * @returns Object in which keys are property names and values are property values
     */
    mapStateToProps(state) {
        return {
            isLogin: state.isLogin,
            authenticating: state.authenticating
        }
    }
    /**
     * Function defines methods which will be available inside component, which this controller manages
     * @param dispatch - Store dispatch functions, allows to transfer actions to Redux store
     * @returns object of methods, which are available in component
     */
    mapDispatchToProps(dispatch) {
        return {
            checkLogin: () => this.checkLogin()
        }
    }

    /**
     * Method used to check if user is logged to system. If not, moves to "Login" screen
     */
    checkLogin() {
        return;
        if (!Store.getState().isLogin)
            NavigationService.navigate("Login");
    }
}

const app = new AppContainer();
const App = connect(app.mapStateToProps.bind(app),app.mapDispatchToProps.bind(app))(AppComponent);
export {App}