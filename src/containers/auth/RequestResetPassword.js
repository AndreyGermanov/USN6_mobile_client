import {connect} from "react-redux";
import {Auth} from '../../components/Components';
import EntityItemContainer from '../items/Entity';
import Models from '../../models/Models';
import t from "../../utils/translate/translate";
import NavigationService from "../../utils/NavigationService";

/**
 * Controller class for Account Item component. Contains all methods and properties, which used by this module.
 */
export default class RequestResetPassword extends EntityItemContainer {

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
        alert(t("Ссылка на форму ввода нового пароля отправлена по указанному email-адресу"));
        NavigationService.navigate("Login");
        callback();
    }

    getDataToSave() {
        const item = super.getDataToSave();
        item["route"] = "request_reset_password";
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
            resetPasswordEmailSent: state.resetPasswordEmailSent
        })
    }

    static getComponent() {
       const reset = new RequestResetPassword();
       return connect(reset.mapStateToProps.bind(reset),reset.mapDispatchToProps.bind(reset))(Auth.RequestResetPassword);
    }
}