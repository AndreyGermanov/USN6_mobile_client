import {connect} from "react-redux";
import {Auth} from '../../components/Components';
import EntityItemContainer from '../items/Entity';
import Models from '../../models/Models';
import NavigationService from '../../utils/NavigationService';
import t from '../../utils/translate/translate';

/**
 * Controller class for Account Item component. Contains all methods and properties, which used by this module.
 */
export default class RegisterContainer extends EntityItemContainer {

    /**
     * Class constructor
     */
    constructor() {
        super();
        this.model = Models.getInstanceOf("user");
    }

    /**
     * Utility function used to check and process response from server in case of success
     * @param err: Error, returned by seriver (if any)
     * @param result: Result from server
     * @param callback: Function which called after complete
     */
    processSaveToBackendSuccessResponse(err,result,callback) {
        alert(t("Ссылка на активацию учетной записи была отправлена по указанному email адресу"));
        NavigationService.navigate("Login");
        callback();
    }

    getDataToSave() {
        const item = super.getDataToSave();
        item["route"] = "register";
        return item;
    }

    /**
     * Method defines set of properties, which are available inside controlled component inside "this.props"
     * @param state: Link to application state
     * @param ownProps: Link to component properties (defined in component tag attributes)
     * @returns Object of properties
     */
    mapStateToProps(state,ownProps) {
        return Object.assign(super.mapStateToProps(state,ownProps),{
            uid: "new",
            registerEmailSent: state.registerEmailSent
        })
    }

    static getComponent() {
       const register = new RegisterContainer();
       return connect(register.mapStateToProps.bind(register),register.mapDispatchToProps.bind(register))(Auth.Register);
    }
}