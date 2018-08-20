import {connect} from "react-redux";
import AccountComponent from '../components/Account';
import EntityContainer from './Entity';
import Backend from '../backend/Backend';
import t from '../utils/translate/translate';
import Store from '../store/Store';
import actions from '../actions/Actions';

/**
 * Controller class for Account component. Contains all methods and properties, which used by this module.
 */
class AccountContainer extends EntityContainer {

    /**
     * Class constructor
     */
    constructor() {
        super();
        this.model = "account";
    }

    /**********************************
     * Item fields validation methods *
     **********************************/

    validate_bank_name(value) {
        if (!this.cleanStringField(value)) return t("Наименование банка не указано");
        return "";
    }

    validate_company(value) {
        if (!this.cleanStringField(value)) return t("Организация не указана");
        return "";
    }

    validate_number(value) {
        if (!this.cleanStringField(value)) return t("Номер счета не указан");
        if (this.cleanIntField(value)===null) return t("Указан некорректный номер счета");
        return "";
    }

    validate_bik(value) {
        if (!this.cleanStringField(value)) return t("БИК не указан");
        if (this.cleanIntField(value)===null) return t("Указан некорректный БИК");
        return "";
    }

    validate_ks(value) {
        if (!this.cleanStringField(value)) return t("Корр. счет не указан");
        if (this.cleanIntField(value)===null) return t("Указан некорректный корр. счет");
        return "";
    }

    /***************************************************
     * Item field values cleanup and transform methods *
     * used to prepare fields to be pushed to database *
     ***************************************************/

    cleanField_bank_name(value) {
        return this.cleanStringField(value);
    }

    cleanField_company(value) {
        return this.cleanStringField(value);
    }


    cleanField_number(value) {
        return this.cleanStringField(value);
    }

    cleanField_bik(value) {
        return this.cleanStringField(value);
    }

    cleanField_ks(value) {
        return this.cleanStringField(value);
    }

    /**
     * Method called after standard "updateItem" action
     */

    updateItem(uid,callback) {
        const self = this;
        super.updateItem(uid, function() {
            self.getCompaniesList((companies_list) => {
                Store.store.dispatch(actions.changeProperty('companies_list', companies_list));
            });
        })
    }

    /**
     * Method defines set of properties, which are available inside controlled component inside "this.props"
     * @param state: Link to application state
     * @param ownProps: Link to component properties (defined in component tag attributes)
     * @returns Array of properties
     */
    mapStateToProps(state,ownProps) {
        var result = super.mapStateToProps(state,ownProps);
        result["listColumns"] = {
            "number": {
                title: t("Номер")
            },
            "bik": {
                title: t("БИК")
            },
            "bank_name": {
                title: t("Банк")
            },
            "company": {
                title: t("Организация")
            }
        }
        if (!result["sortOrder"] || !result["sortOrder"].field) {
            result["sortOrder"] = {field:'number',direction:'ASC'}
        };
        result["companies_list"] = state.companies_list ? state.companies_list : [];
        return result;
    }
}

var account = new AccountContainer();
var Account = connect(account.mapStateToProps.bind(account),account.mapDispatchToProps.bind(account))(AccountComponent);
export {Account};
export default AccountContainer;