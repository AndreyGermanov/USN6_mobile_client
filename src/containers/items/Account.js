import {connect} from "react-redux";
import {Item} from '../../components/Components';
import EntityItemContainer from './Entity';
import t from '../../utils/translate/translate';
import Store from '../../store/Store';
import actions from '../../actions/Actions';
import Models from '../../models/Models';

/**
 * Controller class for Account Item component. Contains all methods and properties, which used by this module.
 */
class AccountItemContainer extends EntityItemContainer {

    /**
     * Class constructor
     */
    constructor() {
        super();
        this.model = Models.getInstanceOf("account");
    }

    /**
     * Method defines set of properties, which are available inside controlled component inside "this.props"
     * @param state: Link to application state
     * @returns Array of properties
     */
    mapStateToProps(state) {
        return Object.assign(super.mapStateToProps(state),{
            "companies_list": state.companies_list ? state.companies_list : []
        })
    }

    /**
     * Method called after standard "updateItem" action
     */
    updateItem(uid) {
        const self = this;
        super.updateItem(uid, function() {
            self.getCompaniesList((companies_list) => {
                Store.store.dispatch(actions.changeProperty('companies_list', companies_list));
            });
        })
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
}

const account = new AccountItemContainer();
export const Account = connect(account.mapStateToProps.bind(account),account.mapDispatchToProps.bind(account))(Item.Account);
export const AccountContainer = account;