import {connect} from "react-redux";
import LoginComponent from '../../components/auth/Login';
import Backend from '../../backend/Backend';
import actions from '../../actions/Actions';
import Store from '../../store/Store';
import t from '../../utils/translate/translate';
import _ from 'lodash';
import NavigationService from '../../utils/NavigationService';

/**
 * Controller used to manager Login form component
 */
export default class LoginContainer {

    /**
     * Method defines set of properties, which are available inside controlled component inside "this.props"
     * @param state: Link to application state
     * @returns Array of properties
     */
    mapStateToProps(state) {
        return {
            errors: state.errors,
            item: state.item
        }
    }

    /**
     * Function defines methods which will be available inside component, which this controller manages
     * @param dispatch - Store dispatch functions, allows to transfer actions to Redux store
     * @returns object of methods, which are available in component
     */
    mapDispatchToProps(dispatch) {
        const self = this;
        return {
            doLogin: () => self.doLogin(),
            changeItemField: (field_name, field_value) => self.changeItemField(field_name, field_value)
        }
    }

    /**
     * Method, called when user presses "Login" button
     */
    doLogin() {
        const props = this.mapStateToProps(Store.getState());
        Store.store.dispatch(actions.changeProperty('errors',{}));
        if (!props.item["login"]) {
            Store.store.dispatch(actions.changeProperty('errors',{"login":t("Введите имя")}));
            return;
        }
        if (!props.item["password"]) {
            Store.store.dispatch(actions.changeProperty('errors',{"password":t("Введите пароль")}));
            return;
        }
        Backend.login(props.item["login"],props.item["password"], function(err) {
            if (err) {
                Store.store.dispatch(actions.changeProperty('errors',{"general":t("Ошибка аутентификации")}));
            } else {
                NavigationService.navigate('App');
            }
        })
    }

    /**
     * Change text field event handler
     * @param field_name: Name of field to change
     * @param field_value: Value to set to the field
     */
    changeItemField(field_name,field_value) {
        const props = this.mapStateToProps(Store.getState());
        const item = _.cloneDeep(props.item);
        item[field_name] = field_value;
        Store.store.dispatch(actions.changeProperty('item',item));
    }

    static getComponent() {
        const login = new LoginContainer();
        return connect(login.mapStateToProps.bind(login),login.mapDispatchToProps.bind(login))(LoginComponent);
    }
}
