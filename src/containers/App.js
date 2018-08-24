import {connect} from "react-redux";
import AppComponent from '../components/App';

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
    mapStateToProps(state,ownProps) {
        return {
            isLogin: state.isLogin,
            authenticating: state.authenticating
        }
    }
}

const app = new AppContainer();
const App = connect(app.mapStateToProps.bind(this),null)(AppComponent);
export {App}